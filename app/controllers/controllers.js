const pool = require("../../config/pool_conexoes");
const bcrypt = require('bcrypt');
const { body } = require("express-validator");

const controller = {
  regrasValidacaocadastro: [
    body('nome').trim().isAlpha('pt-BR', {ignore: ' '}).withMessage('*Nome Inválido'),
    body('cpf').custom(async value => {
      const [cpf] = await pool.query('SELECT * FROM cliente WHERE cpf = ?', [value]);
      if (cpf.length > 0) {
        throw new Error('*CPF em uso!');
      }

      // Validação do CPF
      let soma = 0;

      for (let i = 1; i <= 9; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (11 - i);
      }

      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(value.substring(9, 10))) {
        throw new Error("*CPF inválido!");
      }

      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (12 - i);
      }

      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(value.substring(10, 11))) {
        throw new Error("*CPF inválido!");
      }
    }),
    body('dia').isNumeric({min: 1, max: 31}).withMessage('*Dia Inválido'),
    body('mes').isNumeric({min: 1, max: 12}).withMessage('*Mês Inválido'),
    body('ano').isNumeric({min: 1900, max: new Date().getFullYear()}).withMessage('*Ano Inválido'),
    body('email').isEmail().withMessage('*Email Inválido')
      .custom(async value => {
        const [email] = await pool.query('SELECT * FROM cliente WHERE email = ?', [value]);
        if (email.length > 0) {
          throw new Error('*Email em uso!');
        }
      }),
    body('senha').isStrongPassword().withMessage('*A senha é fraca'),
    body('confirmsenha').isStrongPassword().withMessage('*A senha é fraca e/ou é diferente'),
    body('cep').isNumeric({min: 8}).withMessage('*CEP Inválido')
  ],

  regrasValidacaolog: [
    body('email').isEmail().withMessage('*Email Inválido'),
    body('senha').isStrongPassword().withMessage('*Senha Inválida')
      .custom(async (senha, { req }) => {
        try {
          const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [req.body.email]);
          if (users.length === 0) {
            throw new Error('Usuário não encontrado.');
          }
          const userSenha = users[0].senha;
          console.log(userSenha);
          const senhaCorreta = await bcrypt.compare(senha, userSenha);
          console.log(senhaCorreta);
          if (!senhaCorreta) {
            throw new Error('Senha incorreta.');
          }

          return true;
        } catch (err) {
          console.error(err); // Log de erro para depuração
          throw new Error(err);
        }
      }),
  ]
};

module.exports = controller;
