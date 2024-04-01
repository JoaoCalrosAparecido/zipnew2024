const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");

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

router.post("/create", controller.regrasValidacao, function (req, res) {

});

router.post("/update", controller.regrasValidacao, function (req, res) {
  
});

router.post("/delete", function (req, res) {
  
});

module.exports = router;

