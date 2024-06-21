const models = require("../models/models");
const { body, validationResult } = require("express-validator");

const controller = {
  regrasValidacao: [
    body('nome').trim().isAlpha('pt-BR', {ignore: ' '}).withMessage('Nome Invalido'),
    body('cpf').isNumeric({max: 10}).withMessage('CPF Invalido'),
    body('dia').isNumeric({max: 2}).withMessage('Dia Invalido'),
    body('mes').isNumeric({max: 2}).withMessage('Mes Invalido'),
    body('ano').isNumeric({max: 4}).withMessage('Ano Invalido'),
    body('email').isEmail().withMessage('Email Invalido'),
    body('senha').isStrongPassword().withMessage('A senha é fraca'),
    body('confirmsenha').isStrongPassword().withMessage('As senhas não são compativeis'),
    body('cep').isNumeric({min: 8}).withMessage('CEP Invalido')
  ]
};


module.exports = controller