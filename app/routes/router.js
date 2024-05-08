const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")

router.get("/",  function (req, res) {
  res.render('pages/index', {msg: 'Back-end funcionando'});
});

router.get("/bazar",  function (req, res) {
  res.render('pages/bazar', {msg: 'Back-end funcionando'});
});

router.get("/cadastro",  function (req, res) {
  res.render('pages/cadastro', {msg: 'Back-end funcionando'});
});

router.get("/login_do_usuario",  function (req, res) {
  res.render('pages/login_do_usuario', {msg: 'Back-end funcionando'});
});

router.get("/login_fornecedor",  function (req, res) {
  res.render('pages/login_fornecedor', {msg: 'Back-end funcionando'});
});

router.get("/bolsa_preta_classica",  function (req, res) {
  res.render('pages/bolsa_preta_classica', {msg: 'Back-end funcionando'});
});

router.get("/cart",  function (req, res) {
  res.render('pages/cart', {msg: 'Back-end funcionando'});
});

router.get("/pagamento",  function (req, res) {
  res.render('pages/pagamento', {msg: 'Back-end funcionando'});
});

router.post("/sign/register", controller.regrasValidacao, function (req, res) {
    const {nome, cpf, dia, mes, ano, email, senha, confirmsenha, cep} = req.body;

    const data = `${dia}/${mes}/${ano}`

    // fazer validação dos dados
    // if(nome...)

    connection.query("INSERT INTO cliente (Nome_Cliente, cpf_cliente, senha_Cliente, data_nasc_cliente, logradouro_cliente, contato_cliente, celular_cliente) VALUES (?, ?, ?, ?, ?, ?, ? )", [nome, cpf, senha, data, cep, '', '']);
    res.redirect('/')
});

router.post("/update", controller.regrasValidacao, function (req, res) {
  
});

router.post("/delete", function (req, res) {
  
});

module.exports = router;

