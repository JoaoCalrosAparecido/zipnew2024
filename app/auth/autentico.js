const {  ValidationResult  } = require("express-validator");
const usuario = require("../models/models");
const bcrypt = require("bcrypt");

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null};
    }
    req.session.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

gravarUsuAutenticado = async (req, res, next) => {
    erros = validationResult(req)
    if (erros.isEmpty()) {
        var dadosForm = {
            user_usuario: req.body.nome_usu,
            senha_usuario: req.body.senha_usu,
        };
        var results = await usuario.findUserEmail(dadosForm);
        var total = Object.keys(results).length;
        if (total == 1) {
            if (bcrypt.compareSync(dadosForm.senha_usuario, results[0]. senha_usuario)) {
                var autenticado = {
                    autenticado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                    tipo: results[0].tipo_usuario
                };
            }
        } else {
            var autenticado = { autenticado: null, id: null, tipo: null} ;;
        }
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null} ;;
    }
    req.session.autenticado = autenticado;
}

verificarUsuAutorizado = (destinoFalha, objectJson ,tipoPermitido = null) => {
    return (req, res, next) => {
        if (req.session.autenticado.autenticado != null // && tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined
) {
        next();
        } else {
            res.render(destinoFalha, objectJson);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}