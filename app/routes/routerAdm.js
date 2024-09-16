const express = require("express");
const router = express.Router();
const { verificarUsuAutorizado, limparSessao, verificarUsuAutenticado } = require("../auth/autentico");
const multer = require('multer');
const upload = multer({ dest: './app/public/IMG/uploads/' });
const admController = require("../controllers/admController");

router.get("/adm",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null,

  },
    [3]
  ), function (req, res) {
    res.render("./pages/administrador", { page: "../partial/adm/index" })
  })

router.get("/adm-famosos",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  ), function (req, res) {
    admController.mostrarFamosos(req, res)
  })

router.get("/adm-denuncias",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  ), function (req, res) {
    res.render("./pages/administrador", { page: "" })
  })

router.post("/aprovarFamoso",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  )
  , function (req, res) {
    admController.aprovarFamoso(req, res)
  })

router.post("/negarFamoso",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  ), function (req, res) {
    admController.negarFamoso(req, res)
  })


module.exports = router;

