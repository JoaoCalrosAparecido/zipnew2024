const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");
const denunciasModels = require("../models/denunciasModels");

const denunciaController = {
    denunciarP: async (req, res) => {
        const user = await models.findUserById(req.session.autenticado.id)


        const { Repetido, ForaTema, MaQualidade } = req.body
        const dadosDenuncia = {
            id_prod_cliente: 98,
            id_Cliente: user,
            repetido: Repetido,
            fora_tema: ForaTema,
            ma_qualidade: MaQualidade,
        }
        
        const denunciarProd = await denunciasModels.denunciarProd(dadosDenuncia)
    }
}

module.exports = denunciaController;