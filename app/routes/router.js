const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")
const bcrypt = require("bcrypt");
const { verificarUsuAutorizado, limparSessao, verificarUsuAutenticado } = require("../auth/autentico");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");

const multer = require('multer');
const bazarController = require("../controllers/bazarController");
const upload = multer({ dest: './app/public/IMG/uploads/' });


router.get("/", verificarUsuAutenticado, function (req, res) {
  if (req.session.autenticado && req.session.autenticado.id) {
    res.render('pages/index', { logado: true, usuarioautenticado: req.session.autenticado.id });
  } else {
    res.render('pages/index', { logado: false, usuarioautenticado: null });
  }
});

router.get("/bazar", function (req, res) {
  res.render('pages/bazar', { msg: 'Back-end funcionando' });
});

router.get("/administrador", function (req, res) {
  res.render('pages/administrador', { msg: 'Back-end funcionando' });
});

router.get("/cadastro", function (req, res) {
  res.render('pages/cadastro',
    { erros: null, dadosform: { nome: '', cpf: '', dia: '', mes: '', ano: '', email: '', senha: '', confirmsenha: '', cep: '' }, logado: false, usuarioautenticado: req.session.userid });
});

router.get("/login_do_usuario", verificarUsuAutenticado, async function (req, res) {
  if (req.session.autenticado && req.session.autenticado.id != null) {
    return res.redirect("/perfil")
  }
  res.render('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: req.session.userid });
});

router.get("/perfil",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id);

    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    res.render('pages/perfil', { usuario: user, Bazar: bazar });
  }
);

router.post("/socialmedia",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1]),
  async function (req, res) {

    const { socialLinks } = req.body;
    const userId = req.session.autenticado.id;
    await connection.query("UPDATE cliente SET Url_site = ? WHERE id_Cliente = ?;", [socialLinks, userId]);
    const user = await models.findUserById(userId);
    res.render('pages/perfil', { erros: null, logado: true, usuarioautenticado: userId, usuario: user });
  }
);

router.get("/bolsa_preta_classica", function (req, res) {
  res.render('pages/bolsa_preta_classica', { msg: 'Back-end funcionando' });
});

router.get("/cart",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/cart', { msg: 'Back-end funcionando' });
  });

router.get("/pagamento",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/pagamento', { msg: 'Back-end funcionando' });
  });

router.get("/masculino", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('masculino')

  res.render('pages/masculino', { produtos, msg: 'Back-end funcionando' });
});

router.get("/feminino", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('feminino')

  res.render('pages/feminino', { produtos, msg: 'Back-end funcionando' });
});

router.get("/infantil", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('infantil')

  res.render('pages/infantil', { produtos, msg: 'Back-end funcionando' });
});

router.get("/acessorios", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('acessorios')

  res.render('pages/acessorios', { produtos, msg: 'Back-end funcionando' });
});

router.get("/vender", function (req, res) {
  res.render('pages/vender', { msg: 'Back-end funcionando' });
});

router.get(
  '/produtos/:id_prod_cliente',
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async (req, res) => {
    try {
      const produtoId = parseInt(req.params.id_prod_cliente);
      const [produto] = await connection.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
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
);

router.get("/meusdados",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    controller.mostrarPerfil(req, res)
  });

router.post("/atualizardados",
  controller.regrasValidacaoperfil,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    controller.gravarPerfil(req, res)
  });

router.get("/wishlist",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/wishlist', { msg: 'Back-end funcionando' });
  });

router.get("/adc-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2]),
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id)
    console.log(user)
    res.render('pages/adc-produto', { usuario: user, erros: null, usuarioautenticado: req.session.autenticado })
  });

// [, ]
router.post("/adicionar-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  upload.fields([{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }, { name: 'img4' }]),
  controller.regrasValidacaoAdcProduto,
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.render('pages/adc-produto', { msg: 'Back-end funcionando', usuario: user, erros: errors });
    }

    const { cateProduto, tituloProduto, precoProduto, descProduto } = req.body;

    const userBazar = await produtosModels.findBazarByUserId(req.session.autenticado.id)

    const dadosProduto = {
      tituloprod: tituloProduto,
      preçoprod: precoProduto,
      descProduto: descProduto,
      cateProduto: cateProduto,
      Id_Bazar: userBazar ? userBazar.Id_Bazar : null,
      id_Cliente: req.session.autenticado.id,
      img1: req.files.img1[0].filename,
      img2: req.files.img2[0].filename,
      img3: req.files.img3[0].filename,
      img4: req.files.img4[0].filename,
    }

    const createProd = await produtosModels.createProd(dadosProduto)
    console.log(createProd)
    if (cateProduto == "feminino") {
      res.redirect("/feminino")
    } else if (cateProduto == "masculino") {
      res.redirect("/masculino")
    } else if (cateProduto == "infantil") {
      res.redirect("/infantil")
    } else if (cateProduto == "acessorios") {
      res.redirect("/acessorios")
    }
  });

router.post("/sign/register", controller.regrasValidacaocadastro, async function (req, res) {
  const erros = validationResult(req);

  console.log(erros);

  if (!erros.isEmpty()) {
    return res.render('pages/cadastro', {
      erros: erros, dadosform: {
        nome: req.body.nome,
        cpf: req.body.cpf,
        dia: req.body.dia,
        mes: req.body.mes,
        ano: req.body.ano,
        email: req.body.email,
        senha: req.body.senha,
        confirmsenha: req.body.confirmsenha,
        cep: req.body.cep
      },
      logado: false
    });
  }

  try {
    const { nome, cpf, dia, mes, ano, email, senha, confirmsenha, cep } = req.body;

    const nasc = `${ano}-${mes}-${dia}`

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);
    const hashPassword = bcrypt.hashSync(confirmsenha, salt);

    const create = await connection.query("INSERT INTO cliente (nome, cpf, nasc, email, senha, confirmsenha, cep, Id_Tipo_Usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, cpf, nasc, email, hashedPassword, hashPassword, cep, 1]);
    console.log(create)
    const usuario = await connection.query("SELECT * FROM cliente WHERE id_Cliente = ?", [create.insertId]);
    req.session.autenticado = {
      autenticado: usuario[0].nome,
      id: usuario[0].id_Cliente,
      tipo: usuario[0].Id_Tipo_Usuario
    }

    res.render('pages/login_do_usuario', { erros: null, dadosform: { email: req.body.email, senha: req.body.senha }, logado: true, usuarioautenticado: req.session.userid })
  } catch (error) {
    console.log(error)
  }
});

router.post("/sign/login", controller.regrasValidacaolog, async function (req, res) {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    console.log(erros);
    return res.render('pages/login_do_usuario', { erros: erros, dadosform: { email: req.body.email, senha: req.body.senha }, logado: false, usuarioautenticado: req.session.userid });
  }

  try {
    const { email } = req.body;
    const [user] = await connection.query("SELECT * FROM cliente WHERE email = ?", [email]);
    req.session.autenticado = { autenticado: user[0].nome, id: user[0].id_Cliente, tipo: user[0].Id_Tipo_Usuario }
    if (req.session.autenticado.tipo == 3) {
      res.redirect("/adm");
    }
    res.redirect("/perfil");

  } catch (error) {
    console.log("erro:" + error)
  }
});

router.get('/sair', limparSessao, function (req, res) {
  res.redirect('/');
});

router.post("/update", controller.regrasValidacaocadastro, function (req, res) {

});

router.post("/delete", function (req, res) {

});

router.get("/adc-bazar",

  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [2, 3]
  ), async function (req, res) {
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    res.render('pages/adc-bazar.ejs' , { Bazar: bazar });
  })


router.post("/bazarAdc", verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [2, 3]
  ), function (req, res) {
    bazarController.submitBazar(req, res)
  });

module.exports = router;

