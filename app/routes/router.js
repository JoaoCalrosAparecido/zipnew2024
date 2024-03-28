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

router.post("/create", controller.regrasValidacao, function (req, res) {

});

router.post("/update", controller.regrasValidacao, function (req, res) {
  
});

router.post("/delete", function (req, res) {
  
});

module.exports = router;

