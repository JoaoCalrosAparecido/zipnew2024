const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const admModel = require("../models/admModels");
const produtosModels = require("../models/produtos.models");
const denunciasModels = require("../models/denunciasModels");

const denunciaController = {
    denunciarP: async (req, res) => {
        try {
            const userId = req.session.autenticado.id;
            const produtoId = parseInt(req.params.id_prod_cliente);
            const [produtos] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
    
            // // Verifica se o produto existe
            // if (produtos.length === 0) {
            //     return res.status(404).send("Produto não encontrado.");
            // }
    
            // Verifica se o usuario ja fez uma denuncia
            const [denunciasExistentes] = await pool.query(
                'SELECT * FROM `denuncias_produto` WHERE id_Cliente = ? AND id_prod_cliente = ?',
                [userId, produtoId]
            );
            if (denunciasExistentes.length > 0) {
                return res.status(400).send("Você já denunciou este produto.");
            }
    
            const { Repetido, ForaTema, MaQualidade } = req.body;
    
            const dadosDenuncia = {
                id_prod_cliente: produtoId,
                id_Cliente: userId, 
                repetido: !!Repetido, 
                fora_tema: !!ForaTema,
                ma_qualidade: !!MaQualidade,
            };
    
            // Definir o limite
            const max_denuncias = 8;
    
            await denunciasModels.denunciarProd(dadosDenuncia);
    
            // Verifica o número total de denúncias
            const [totalDenuncias] = await pool.query(
                'SELECT COUNT(*) as total FROM `denuncias_produto` WHERE id_prod_cliente = ?',
                [produtoId]
            );
    
            // Verifica se atingiu o limite
            if (totalDenuncias[0].total >= max_denuncias) {
                await pool.query('DELETE FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
    
                return res.status(200).send(`Produto ${produtoId} foi removido devido ao número elevado de denúncias.`);
            }
    
            res.status(200).send("Denúncia registrada com sucesso.");

        } catch (error) {
            console.error("Erro ao processar a denúncia:", error);
            res.status(500).send("Erro ao processar a denúncia.");
        }
    },




    denunciarV: async (req, res) => {
        try {
            const userId = req.session.autenticado.id; 
            const produtoId = parseInt(req.params.id_prod_cliente);
    
            const [produtos] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
            if (produtos.length === 0) {
                return res.status(404).send("Produto não encontrado.");
            }

            // id vendedor
            const idClienteDenunciado = produtos[0].id_Cliente;  
    
            // Verifica se o usuario ja fez uma denuncia contra o vendedor
            const [denunciasExistentes] = await pool.query(
                'SELECT * FROM `denuncias_vendedor` WHERE id_Cliente = ? AND id_Cliente_denunciado = ?',
                [userId, idClienteDenunciado]
            );
            if (denunciasExistentes.length > 0) {
                return res.status(400).send("Você já denunciou este vendedor.");
            }
    
            const { Fraude, Ilícito, Enganosa } = req.body;
    
            const dadosDenunciaV = {
                id_Cliente: userId, 
                id_Cliente_denunciado: idClienteDenunciado, 
                fraude: !!Fraude, 
                produto_ilicito: !!Ilícito,
                propaganda_enganosa: !!Enganosa,
            };
    
            await denunciasModels.denunciarVend(dadosDenunciaV);
    
            res.status(200).send("Denúncia registrada com sucesso.");
        } catch (error) {
            console.error("Erro ao processar a denúncia:", error);
            res.status(500).send("Erro ao processar a denúncia.");
        }
    },



}

module.exports = denunciaController;