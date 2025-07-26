const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verifyToken } = require("../middlewares/auth");

router.post("/register", usuarioController.registrarUsuario);

router.post("/login", usuarioController.loginUsuario);

router.get("/perfil", verifyToken, usuarioController.obtenerPerfil);

module.exports = router;
