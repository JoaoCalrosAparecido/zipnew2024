const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");

const bazarController = {
    submitBazar: async (req, res) => {
        const userId = req.session.autenticado.id;
        const user = await models.findUserById(userId);
        const bazar = await produtosModels.findBazarByUserId(userId);
        const { Nome, Ano, Descricao, Titulo, Biografia } = req.body;

        await pool.query("INSERT INTO bazar (nome, ano, descricao, titulo, biografia, id_Cliente) VALUES (?, ?, ?, ?, ?, ?) ", [Nome, Ano, Descricao, Titulo, Biografia, userId]);

        res.render('pages/perfil', { erros: null, logado: true, usuarioautenticado: userId, usuario: user, Bazar: bazar });
    },


    // verificarBazar: async (req,res) => {
    //      const userId = req.session.autenticado.id;
    //      const bazar = await prodModels.findBazarByUserId(userId);
    //  }
}

module.exports = bazarController;