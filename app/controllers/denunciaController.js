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
    
            // Verifica se o usuário já fez uma denúncia
            const [denunciasExistentes] = await pool.query(
                'SELECT * FROM `denuncias_produto` WHERE id_Cliente = ? AND id_prod_cliente = ?',
                [userId, produtoId]
            );
            if (denunciasExistentes.length > 0) {
                const produto = produtos[0];
                const jsonResult = {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: req.session.autenticado.nomeCliente,
                    listaErros: null,
                    dadosNotificacao: { 
                        title: "Você já denunciou este produto", 
                        msg: "Produto já denunciado", 
                        type: 'info' 
                    }
                };
                return res.render('pages/produtos', jsonResult);
            }
    
            // Verificação de erros
            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                const produto = produtos[0];
                const jsonResult = {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: req.session.autenticado.nomeCliente,
                    dadosNotificacao: { 
                    
                        title: "Preencha um dos campos", 
                        msg: "Campos vazios", 
                        type: 'warning' 
                    }
                };
                return res.render('pages/produtos', jsonResult);
            }
    
            // Verifica quais caixas foram selecionadas
            const motivos = req.body.Caixa || [];
    
            const dadosDenuncia = {
                id_prod_cliente: produtoId,
                id_Cliente: userId,
                repetido: motivos.includes('repetido'),
                fora_tema: motivos.includes('foraTema'),
                ma_qualidade: motivos.includes('maQualidade')
            };
    
            await denunciasModels.denunciarProd(dadosDenuncia);
    
            const produto = produtos[0];
            const jsonResult = {
                usuarioautenticado: req.session.autenticado, 
                produto: produto,
                nomeCliente: req.session.autenticado.nomeCliente,
                listaErros: null,
                dadosNotificacao: { 
                    title: "Sua denúncia foi enviada", 
                    msg: "Denúncia realizada com sucesso", 
                    type: 'success' 
                }
            };
            return res.render('pages/produtos', jsonResult);
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
            
            const produto = produtos[0];
    
            if (denunciasExistentes.length > 0) {
                const jsonResult = {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: req.session.autenticado.nomeCliente,
                    dadosNotificacao: { 
                        title: "Você já denunciou este vendedor", 
                        msg: "Vendedor já denunciado", 
                        type: 'info' 
                    }
                };
                return res.render('pages/produtos', jsonResult);
            }

            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                const produto = produtos[0];
                const jsonResult = {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: req.session.autenticado.nomeCliente,
                    dadosNotificacao: { 
                    
                        title: "Preencha um dos campos", 
                        msg: "Campos vazios", 
                        type: 'warning' 
                    }
                };
                return res.render('pages/produtos', jsonResult);
            }
    
            const motivos = req.body.Caixo || [];
    
            const dadosDenunciaV = {
                id_Cliente: userId, 
                id_Cliente_denunciado: idClienteDenunciado, 
                fraude: motivos.includes('fraude'), 
                produto_ilicito: motivos.includes('produtoIlicito'),
                propaganda_enganosa: motivos.includes('propagandaEnganosa'),
            };
    
            await denunciasModels.denunciarVend(dadosDenunciaV);
    
            const jsonResult = {
                usuarioautenticado: req.session.autenticado, 
                produto: produto,
                nomeCliente: req.session.autenticado.nomeCliente,
                dadosNotificacao: { 
                    title: "Sua denúncia foi enviada", 
                    msg: "Denúncia realizada com sucesso", 
                    type: 'success' 
                }
            };
            return res.render('pages/produtos', jsonResult);
        } catch (error) {
            console.error("Erro ao processar a denúncia:", error);
            res.status(500).send("Erro ao processar a denúncia.");
        }
    }
    



}

module.exports = denunciaController;