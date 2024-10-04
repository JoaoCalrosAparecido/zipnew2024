const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");
const admModel = require("../models/admModels");
const models = require('../models/models');

const admController = {
    mostrarFamosos: async (req, res) => {
        try {
            const userPreFamosos = await admModel.chamarPreFamosos()
            const jsonResult = {
                listaUsuarios: userPreFamosos,
                page: "../partial/adm/preFamosos"
            }

            res.render("./pages/tabelasAdm", jsonResult)

        } catch (error) {

        }
    },

    mostrarDenuncias: async (req, res) => {
        try {
            const jsonResult = {
                page: "../partial/adm/denuncias"
            }

            res.render("./pages/tabelasAdm", jsonResult)

        } catch (error) {

        }
    },


    aprovarFamoso: async (req, res) => {
        const idUsuario = req.query.idUsuario
        const resultUpdate = await admModel.alterarTipoUsuario(2, idUsuario)
        console.log(resultUpdate)

        res.redirect("/adm-famosos")
    },
    negarFamoso: async (req, res) => {
        const idUsuario = req.query.idUsuario
        const resultUpdate = await admModel.alterarUrl(null, idUsuario)
        console.log(resultUpdate)

        res.redirect("/adm-famosos")
    }
}

module.exports = admController