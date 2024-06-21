const models = require("../models/models");
const { body, validationResult } = require("express-validator");

const controller = {
  regrasValidacao: [
    body('nome').isAlpha({min: 3}),
    body('cpf').isString({max: 10}),
    body('dia').isNumeric({max: 2}),
    body('mes').isNumeric({max: 2}),
    body('ano').isNumeric({max: 4}),
    body('email').isEmail(),
    body('senha').isStrongPassword(),
    body('confirmsenha').isStrongPassword(),
    body('cep').isString({min: 8}),
  ],
  

  cadastrarUsuario: async (req, res) => {
    try {
      const erros = validationResult(req);

      if (erros) {
        res.render('pages/cadastro', { erros: erros });
        return;
      }

      const dadosForm = {
        nome: req.body.nome,
        cpf: req.body.cpf,
        senha: req.body.senha,
        nasc: req.body.nasc,
        cep: req.body.cep,
        email: req.body.email,
      }
      //const result = await models.create(dadosForm)

      res.render('/sign/login', { dadosUsuario: [dadosForm.email, dadosForm.senha] })


    } catch (error) {

    }
  }
};


module.exports = controller