const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerMisOrdenes,
  obtenerTodasLasOrdenes,
} = require("../controllers/ordenController");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, crearOrden);

router.get("/mis-ordenes", verifyToken, obtenerMisOrdenes);

router.get("/admin", verifyToken, verifyAdmin, obtenerTodasLasOrdenes);

module.exports = router;