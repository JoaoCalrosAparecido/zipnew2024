const pool = require("../../config/pool_conexoes");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require('../models/produtos.models');


const controller = {
  regrasValidacaocadastro: [
    body('nome').trim().isAlpha('pt-BR', { ignore: ' ' }).withMessage('*Nome Inválido'),
    body('cpf')
    .customSanitizer(value => value.replace(/[\.\-]/g, '')) // Tira os hífens e os pontin
    .custom(async value => {
      // Verifica se o CPF já está em uso no banco de dados
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

    body('cep')
    .customSanitizer(value => value.replace('-', '')) // Tira os hífens
    .isLength({ min: 8, max: 8 }).isNumeric().withMessage('*CEP Inválido'),


    body('dia').isInt({ min: 1, max: 31 }).withMessage('*Dia Inválido'),
    body('mes').isInt({ min: 1, max: 12 }).withMessage('*Mês Inválido'),
    body('ano').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('*Ano Inválido'),
    body('email').isEmail().withMessage('*Email Inválido')
      .custom(async value => {
        const [email] = await pool.query('SELECT * FROM cliente WHERE email = ?', [value]);
        if (email.length > 0) {
          throw new Error('*Email em uso!');
        }
      }),

    body('senha').isStrongPassword().withMessage('*A senha é fraca'),
  // Verifica se as senhas são iguais
  body('confirmsenha').custom((value, { req }) => {
    if (value !== req.body.senha) {
      throw new Error('*As senhas não são iguais');
    }
    return true;
  })



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
          const senhaCorreta = await bcrypt.compare(senha, userSenha);
          if (!senhaCorreta) {
            throw new Error('Senha incorreta.');
          }

          return true;
        } catch (err) {
          console.error(err); // Log de erro para depuração
          throw new Error(err);
        }
      }),
  ],
  regrasValidacaoAdcProduto: [
    body('tituloProduto').isString().isLength({ min: 3, max: 45 }),
    body('precoProduto').isNumeric({ min: 0.1 }),
    body('descProduto').isString().isLength({ min: 25, max: 220 }),
  ],

  regrasValidacaoperfil: [
    body('nome').isLength({ min: 3, max: 45 }).withMessage("*Nome deve ter de 3 a 45 caracteres!"),
    body('email').isEmail().withMessage('*Email Inválido'),
    body('cep')    
    .customSanitizer(value => value.replace('-', '')) // Tira os hífens
    .isLength({ min: 8, max: 8 }).isNumeric().withMessage('*CEP Inválido'),
  ],

  mostrarPerfil: async (req, res) => {
    const user = await models.findUserById(req.session.autenticado.id)
    const data = new Date(user.nasc)
    const dataFormatada = data.toISOString().split('T')[0];
    try {
      // if (user.cep != null) {
      //   const httpsAgent = new https.Agent({
      //     rejectUnauthorized: false,
      //   });
      //   const response = await fetch(`https://viacep.com.br/ws/${user.cep}/json/`,
      //     { method: 'GET', headers: null, body: null, agent: httpsAgent, });
      //   var viaCep = await response.json();
      //   var cep = user.cep.slice(0, 5) + "-" + user.cep.slice(5);
      // } else {
      //   var viaCep = { logradouro: "", bairro: "", localidade: "", uf: "" }
      //   var cep = null;
      // }
      let campos = {
        nome: user.nome,
        cpf: user.cpf,
        nasc: user.nasc,
        cep: user.cep,
        email: user.email,
        nasc: dataFormatada,
        senha: ""
      };

      res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: null, valores: campos });
    } catch (e) {
      console.log(e);
      res.render("pages/Config/meusdados",
        {
          listaErros: null,
          dadosNotificacao: null,
          valores: {
            nome: "",
            cpf: "",
            nasc: "",
            cep: "",
            email: "",
            nasc: "",
            senha: ""
          }
        });
    }
  },
  gravarPerfil: async (req, res) => {

    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;
    if (!erros.isEmpty() || erroMulter != null) {
      lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter != null) {
        lista.errors.push(erroMulter);
      }
      console.log(lista)
      return res.render("pages/Config/meusdados", { listaErros: lista, dadosNotificacao: null, valores: req.body })
    }
    try {
      let { nome, email, cep, nasc, senha } = req.body
      var dadosForm = {
        nome: nome,
        email: email,
        cep: cep,
        nasc: nasc,
      };

      if (senha != "") {
        const salt = bcrypt.genSaltSync(10);
        dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
      }

      let resultUpdate = await models.update(dadosForm, req.session.autenticado.id);

      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var user = await models.findUserById(req.session.autenticado.id);
          const data = new Date(user.nasc)
          const dataFormatada = data.toISOString().split('T')[0];
          var autenticado = {
            autenticado: user.nome,
            id: user.id_Cliente,
          };
          req.session.autenticado = autenticado;
          let campos = {
            nome: user.nome,
            cpf: user.cpf,
            nasc: user.nasc,
            cep: user.cep,
            email: user.email,
            nasc: dataFormatada,
            senha: ""  
          };
          console.log("Atualizado")
          res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "sucess" }, usuario: user, valores: campos });
        } else {
          console.log("Atualizado 2")
          res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem Alterações", tipo: "sucess" }, usuario: user, valores: dadosForm });
        }
      }
    } catch (e) {
      console.log(e)
      res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body });
    }
  },

  mostrarProduto: async (req, res) => {
    try {
      const produtoId = parseInt(req.params.id_prod_cliente);
      const [produto] = await produtosModels.findProdById(produtoId)
      console.log(produto);
      
      if (produto) {
          res.render('pages/produtos', { usuarioautenticado: req.session.autenticado, produto: produto[0] })
      } else {
          res.status(404).send('Produto não encontrado');
      }
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = controller;
