const pool = require("../../config/pool_conexoes");
const bcrypt = require('bcrypt');
const { body, validationResult, check } = require("express-validator");
const models = require("../models/models");
const produtosModels = require('../models/produtos.models');


const controller = {
  regrasValidacaocadastro: [
    body('nome').trim().isAlpha('pt-BR', { ignore: ' ' }).withMessage('*Nome Inválido'),
    body('cpf')
    .customSanitizer(value => value.replace(/[\.\-]/g, ''))
    .custom(async value => {
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

    // body('cep')
    // .customSanitizer(value => value.replace('-', '')) // Tira os hífens
    // .isLength({ min: 8, max: 8 }).isNumeric().withMessage('*CEP Inválido'),


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
  body('confirmsenha').custom((value, { req }) => {
    if (value !== req.body.senha) {
      throw new Error('*As senhas não são iguais');
    }
    return true;
  }),
  body('Privacidade').equals('on').withMessage('*É presiso aceitar os termos')


  ],
  regrasValidacaolog: [
    body('email').isEmail().withMessage('*Email Inválido'),
    body('senha')
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
          console.error(err);
          throw new Error(err);
        }
      }),
  ],
  regrasValidacaoAdcProduto: [
    body('tituloProduto').isString().isLength({ min: 3, max: 45 }).withMessage("*O Titulo deve ter de 3 a 45 caracteres!"),
    body('precoProduto').isNumeric({ min: 0.1 }).withMessage("*O preço deve ser no minimo R$ 0.1"),
    body('descProduto').isString().isLength({ min: 25, max: 220 }).withMessage("*A Descrição deve ter de 25 a 220 caracteres!"),
  ],

  regrasValidacaoperfil: [
    body('nome').isLength({ min: 3, max: 45 }).withMessage("*Nome deve ter de 3 a 45 caracteres!"),
    body('email').isEmail().withMessage('*Email Inválido'),
    body('senha').custom((senha, {req}) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_])/;
      if (!senha){
        return true
      }  
      if (senha.length < 8 || !regex.test(senha)){
        throw new Error('*A senha é fraca');
      }
      return true
    })
  ],

  mostrarPerfil: async (req, res) => {
    const user = await models.findUserById(req.session.autenticado.id)
    const bazar = await produtosModels.findBazarByUserId(user);
    const data = new Date(user.nasc)
    const dataFormatada = data.toISOString().split('T')[0];
    try {
      let campos = {
        nome: user.nome,
        cpf: user.cpf,
        nasc: user.nasc,
        email: user.email,
        nasc: dataFormatada,
        senha: ""
      };

      return res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: null, valores: campos, Bazar:bazar, formAprovado: false });
    } catch (e) {
      console.log(e);
      return res.render("pages/Config/meusdados",
        {
          listaErros: null,
          dadosNotificacao: null,
          Bazar:bazar,
          valores: {
            nome: "",
            cpf: "",
            nasc: "",
            email: "",
            nasc: "",
            senha: ""
          }
        });
    }
  },

  gravarPerfil: async (req, res) => {
    const userId = await models.findUserById(req.session.autenticado.id)
    const bazar = await produtosModels.findBazarByUserId(userId);
    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;
    if (!erros.isEmpty() || erroMulter != null) {
      lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter != null) {
        lista.errors.push(erroMulter);
      }
      console.log(lista)
      return res.render("pages/Config/meusdados", {
        usuario: user,
        Bazar:bazar,
        listaErros: lista,
        dadosNotificacao: null,
        listaProdBazar: [],
        valores: {
          nome: req.body.nome,
          email: req.body.email,
          cpf: req.body.cpf,
          nasc: req.body.nasc,
        }});
    }
    try {
      let { nome, email, nasc, senha } = req.body
      var dadosForm = {
        nome: nome,
        email: email,
        nasc: nasc,
      };

      if (senha != "") {
        const salt = bcrypt.genSaltSync(10);
        dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
      }

      let resultUpdate = await models.update(dadosForm, req.session.autenticado.id);
      console.log("resultUpdate")
      console.log(resultUpdate)
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var user = await models.findUserById(req.session.autenticado.id);
          const data = new Date(user.nasc)
          const dataFormatada = data.toISOString().split('T')[0];
          var autenticado = {
            autenticado: user.nome,
            id: user.id_Cliente,
            tipo: user.Id_Tipo_Usuario
          };
          req.session.autenticado = autenticado;
          let campos = {
            nome: user.nome,
            cpf: user.cpf,
            nasc: user.nasc,
            email: user.email,
            nasc: dataFormatada,
            senha: ""  
          };
          console.log("Atualizado")
          return res.render("pages/perfil", 
            { listaErros: null, dadosNotificacao: { title: "Perfil! atualizado com sucesso", msg: "Alterações Gravadas", type: "sucess" }, formAprovado: true, Bazar: bazar, usuario: userId, valores: campos });
        } else {
          console.log("Atualizado 2")
          return res.render("pages/perfil", 
            { listaErros: null, dadosNotificacao: { title: "Perfil! atualizado com sucesso", msg: "Sem Alterações", type: "info" }, Bazar: bazar, usuario: userId, valores: dadosForm });
        }
      }

    } catch (e) {
      console.log(e)
      return res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: { title: "Erro ao atualizar o perfil!", msg: "Verifique os valores digitados!", type: "error" }, formAprovado: false, Bazar: bazar, valores: req.body });
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
  },

  regrasValidaçãoURL: [
    body('socialLinks')
    .notEmpty()
    .isURL()
    .withMessage('O link deve ser uma URL válida.')
    .matches(/^(https:\/\/(www\.)?(instagram\.com|youtube\.com|tiktok\.com))/)
    .withMessage('O link deve ser do Instagram, YouTube ou TikTok.')
  ],

  regrasValidaçãoBazar: [
    body('Nome')
      .isString()
      .isLength({ min: 2, max: 10 })
      .withMessage('*O nome deve ter entre 2 e 10 caracteres.'),
      
    body('Ano')
    .isInt({ min: 2000, max: new Date().getFullYear() }).withMessage('*Ano Inválido'),
      
    body('Descricao')
      .isString()
      .isLength({ min: 5, max: 20 })
      .withMessage('*A descrição deve ter entre 5 e 20 caracteres.'),
      
    body('Titulo')
      .isString()
      .isLength({ min: 3, max: 25 })
      .withMessage('*O título deve ter entre 3 e 25 caracteres.'),
      
    body('Biografia')
      .isString()
      .isLength({ min: 10, max: 300 })
      .withMessage('*A biografia deve ter entre 10 e 300 caracteres.')
  ],

  regrasValidaçãoDenunciaP: [
    check('Caixa').custom((valores, {req}) => {
        if (!req.body.Caixa || req.body.Caixa.length === 0) {
            throw new Error('*Selecione pelo menos um motivo');
        }
        return true;
    })
],

regrasValidaçãoDenunciaV: [
  check('Caixo').custom((valores, {req}) => {
      if (!req.body.Caixo || req.body.Caixo.length === 0) {
          throw new Error('*Selecione pelo menos um motivo');
      }
      return true;
  })
]
};

module.exports = controller;


