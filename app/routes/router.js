const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")

router.get("/", function (req, res) {
  res.render('pages/index', { msg: 'Back-end funcionando' });
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

router.get("/login_fornecedor", function (req, res) {
  res.render('pages/login_fornecedor', { msg: 'Back-end funcionando' });
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

router.post("/sign/register", controller.regrasValidacao, function (req, res) {
  try {
    const { nome, cpf, dia, mes, ano, email, senha, confirmsenha, cep } = req.body;

    // fazer validação dos dados
    // if(nome...)

    const create = connection.query("INSERT INTO cliente (Nome_cliente, cpf_cliente, dia, mes, ano, email, Senha, confirmsenha, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [nome, cpf, dia, mes, ano, email, senha, confirmsenha, cep]);
    console.log(create)
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
});

router.post("/update", controller.regrasValidacao, function (req, res) {

});

router.post("/delete", function (req, res) {

});

module.exports = router;

