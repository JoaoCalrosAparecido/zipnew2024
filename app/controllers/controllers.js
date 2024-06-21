const models = require("../models/models");
const { body, validationResult } = require("express-validator");

const controller = {
  regrasValidacao: [
    //body('nome').isAlpha({ignore: [' ', '-']}),
    body('cpf').isString({max: 10}),
    body('dia').isNumeric({max: 2}),
    body('mes').isNumeric({max: 2}),
    body('ano').isNumeric({max: 4}),
    body('email').isEmail(),
    body('senha').isStrongPassword(),
    body('confirmsenha').isStrongPassword(),
    body('cep').isString({min: 8}),
  ]
};


module.exports = controller