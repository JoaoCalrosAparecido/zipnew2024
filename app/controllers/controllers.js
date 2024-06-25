const models = require("../models/models");
const { body, validationResult } = require("express-validator");

const controller = {
  regrasValidacaocadastro: [
    body('nome').trim().isAlpha('pt-BR', {ignore: ' '}).withMessage('Nome Invalido'),
    body('cpf').custom(async value => {
      const cpf = await models.findCampoCustom({'cpf':value});
      if (cpf > 0) {
        throw new Error('CPF em uso!')
      } 
      let soma = 0
      var resultado

      for (i=1; i<=9; i++){
        soma = soma + parseInt(value.substring(i-1, i)) * (11 -i)
      }

      resto = (soma * 10) % 11

      if ((resto == 10) || (resto == 11)){
        resto = 0
      }

      if (resto != parseInt(value.substring(9,10))){
        throw new Error("CPF invalido!")
      }

      soma = 0

      for (i=1; i<=10; i++) {
        soma = soma + parseInt(value.substring(i-1, i)) * (12 -i)
      }

      resto = (soma * 10) % 11

      if ((resto == 10) || (resto == 11)) {
        resto = 0
      }

      if (resto != parseInt(value.substring(10,11))) {
        throw new Error("CPF invalido!")
      
      }
    }),
    body('dia').isNumeric({max: 2}).withMessage('Dia Invalido'),
    body('mes').isNumeric({max: 2}).withMessage('Mes Invalido'),
    body('ano').isNumeric({max: 4}).withMessage('Ano Invalido'),
    body('email').isEmail().withMessage('Email Invalido')
    .custom(async value => {
      const email = await models.findCampoCustom({'email':value});
      if (email > 0) {
        throw new Error('Email em uso!')
      }
    }),
    body('senha').isStrongPassword().withMessage('A senha é fraca'),
    body('confirmsenha').isStrongPassword().withMessage('A senha é fraca'),
    body('cep').isNumeric({min: 8}).withMessage('CEP Invalido')
  ],

  regrasValidacaolog: [
    body('email').isEmail().withMessage('Email Invalido'),
    body('senha').isStrongPassword().withMessage('A senha é fraca'),
  ]
};


module.exports = controller