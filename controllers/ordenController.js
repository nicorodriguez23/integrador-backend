const Orden = require("../models/ordenModel");

const crearOrden = async (req, res) => {
  try {
    const { productos, total } = req.body;
    const nuevaOrden = new Orden({
      usuario: req.usuario.id,
      productos,
      total,
    });
    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error("Error al crear orden:", error.message);
    res.status(500).json({ mensaje: "Error al crear la orden" });
  }
};

const obtenerMisOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuario: req.usuario.id })
      .populate("productos.producto")
      .sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las órdenes" });
  }
};

const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate("usuario", "nombre email")
      .populate("productos.producto")
      .sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener todas las órdenes" });
  }
};

module.exports = {
  crearOrden,
  obtenerMisOrdenes,
  obtenerTodasLasOrdenes,
};
