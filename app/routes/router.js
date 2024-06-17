const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")
const bcrypt = require("bcrypt")

router.get("/", function (req, res) {
  
  const logado = req.session.userid;

  console.log(logado)

  let estalogado = false;

  if (logado) {
    estalogado = true
  }

  res.render('pages/index', { logado: estalogado });
});

router.get("/bazar", function (req, res) {
  res.render('pages/bazar', { msg: 'Back-end funcionando' });
});

router.get("/cadastro", function (req, res) {
  res.render('pages/cadastro', { msg: 'Back-end funcionando' });
});

router.get("/login_do_usuario", function (req, res) {
  res.render('pages/login_do_usuario', { msg: 'Back-end funcionando' });
});

router.get("/perfil", function (req, res) {
  res.render('pages/perfil', { msg: 'Back-end funcionando' });
});

router.get("/bolsa_preta_classica", function (req, res) {
  res.render('pages/bolsa_preta_classica', { msg: 'Back-end funcionando' });
});

router.get("/cart", function (req, res) {
  res.render('pages/cart', { msg: 'Back-end funcionando' });
});

router.get("/pagamento", function (req, res) {
  res.render('pages/pagamento', { msg: 'Back-end funcionando' });
});

router.get("/masculino", function (req, res) {
  res.render('pages/masculino', { msg: 'Back-end funcionando' });
});

router.get("/feminino", function (req, res) {
  res.render('pages/feminino', { msg: 'Back-end funcionando' });
});

router.get("/infantil", function (req, res) {
  res.render('pages/infantil', { msg: 'Back-end funcionando' });
});

router.post("/sign/register", controller.regrasValidacao, async function (req, res) {
  try {
    const { nome, cpf, dia, mes, ano, email, senha, confirmsenha, cep } = req.body;

    // fazer validação dos dados
    // if(nome...)

    const nasc = `${ano}-${mes}-${dia}`

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const create = await connection.query("INSERT INTO cliente (nome, cpf, nasc, email, senha, confirmsenha, cep) VALUES (?, ?, ?, ?, ?, ?, ?)", [nome, cpf, nasc, email, hashedPassword, confirmsenha, cep]);
    console.log(create)
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
});


router.post("/sign/login", async function (req, res) {
  const { email, senha } = req.body;

  try {
    const user = await connection.query("SELECT * FROM cliente WHERE email = ?", [email]);

    if (user.length == 0) {
      // validação caso o usuario não seja encontrado
    }

    const senhaCorreta = bcrypt.compareSync(senha, user[0][0].senha)

    if (!senhaCorreta) {
      // validação senha errada
    }

    // cria sessão do usuario

    req.session.userid = user[0][0].id_Cliente;
    return req.session.save(() => {
      res.redirect("/")
    })

    //req.session.destroy(() => {
    //   res.redirect("/);
    // });

  } catch (error) {
    console.log("erro:" + error)
  }
});

router.get('/sair', function (req, res) {
  try {
    console.log('saiu')

    req.session.destroy(() => {
      res.redirect("/")
    });
  } catch (error) {
    console.log("erro:" + error)
  }
});

router.post("/update", controller.regrasValidacao, function (req, res) {

});

router.post("/delete", function (req, res) {

});

module.exports = router;

