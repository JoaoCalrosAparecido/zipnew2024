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
const upload = multer({ dest: './app/public/IMG/uploads/' });

router.get("/adm",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
  "./pages/login_do_usuario", { 
  erros: null, 
  dadosform: { email: "", senha: "" }, 
  logado: false, 
  usuarioautenticado: null
},
[3]
), function(req,res){
    res.render("./pages/administrador")
})

module.exports = router;

