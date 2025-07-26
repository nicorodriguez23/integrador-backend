const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const uploadProducto = require("../middlewares/uploadProducto");

router.put("/cargar-especificaciones", productoController.cargarEspecificaciones);

router.get("/", productoController.obtenerProductos);
router.get("/:id", productoController.obtenerProductoPorId);

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  uploadProducto.single("imagen"),
  productoController.crearProducto
);

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  uploadProducto.single("imagen"),
  productoController.actualizarProducto
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  productoController.eliminarProducto
);

module.exports = router;
