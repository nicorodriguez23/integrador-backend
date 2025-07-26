const Producto = require("../models/productoModel");
const fs = require("fs");
const path = require("path");

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
  }
};

const crearProducto = async (req, res) => {
  try {
    const imagen = req.file ? `/uploads/${req.file.filename}` : "";

    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen,
      categoria: req.body.categoria,
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    if (req.file) {
      if (producto.imagen) {
        const rutaAnterior = path.join(__dirname, "..", "public", producto.imagen);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }
      producto.imagen = `/uploads/${req.file.filename}`;
    }

    producto.nombre = req.body.nombre || producto.nombre;
    producto.descripcion = req.body.descripcion || producto.descripcion;
    producto.precio = req.body.precio || producto.precio;
    producto.categoria = req.body.categoria || producto.categoria;

    await producto.save();
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    if (producto.imagen) {
      const rutaImagen = path.join(__dirname, "..", "public", producto.imagen);
      if (fs.existsSync(rutaImagen)) fs.unlinkSync(rutaImagen);
    }

    await producto.deleteOne();
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
  }
};

const cargarEspecificaciones = async (req, res) => {
  try {
    const actualizaciones = [
      {
        nombre: "Tarjeta Gráfica RTX 4090",
        especificaciones: [
          "Arquitectura: Ada Lovelace",
          "Memoria: 24GB GDDR6X",
          "Núcleos CUDA: 16,384",
          "Consumo: 450W",
          "Puertos: HDMI 2.1, DisplayPort 1.4a",
        ],
      },
      {
        nombre: "Procesador Intel i9-13900K",
        especificaciones: [
          "Núcleos: 24 (8 Performance + 16 Efficiency)",
          "Velocidad Turbo: Hasta 5.8 GHz",
          "Caché: 36 MB Intel Smart Cache",
          "Socket: LGA1700",
        ],
      },
      {
        nombre: "Memoria RAM Corsair Vengeance",
        especificaciones: [
          "Capacidad: 16GB (2x8GB)",
          "Frecuencia: 3200 MHz",
          "Latencia: CL16",
          "Voltaje: 1.35V",
        ],
      },
      {
        nombre: "Placa Base ASUS ROG Strix",
        especificaciones: [
          "Socket: AM4",
          "Chipset: X570",
          "Memoria: DDR4 hasta 128GB",
          "Puertos: USB 3.2, HDMI, DisplayPort",
        ],
      },
      {
        nombre: "SSD Samsung 970 EVO 1TB",
        especificaciones: [
          "Capacidad: 1TB",
          "Interfaz: NVMe PCIe Gen 3.0 x4",
          "Velocidad lectura: Hasta 3500 MB/s",
          "Velocidad escritura: Hasta 3300 MB/s",
        ],
      },
      {
        nombre: "Fuente de Poder EVGA 750W",
        especificaciones: [
          "Potencia: 750W",
          "Certificación: 80 Plus Gold",
          "Modular: Sí",
          "Ventilador: Silencioso",
        ],
      },
      {
        nombre: "Teclado Mecánico Corsair K70",
        especificaciones: [
          "Switches: Cherry MX",
          "Retroiluminación: RGB",
          "Anti-ghosting: N-Key rollover",
          "Construcción: Aluminio",
        ],
      },
      {
        nombre: "Auriculares SteelSeries Arctis 7",
        especificaciones: [
          "Conectividad: Inalámbrica",
          "Batería: Hasta 24 horas",
          "Micrófono: Retráctil",
          "Sonido: DTS Headphone:X",
        ],
      },
      {
        nombre: "Monitor Acer Predator 27\"",
        especificaciones: [
          "Tamaño: 27 pulgadas",
          "Resolución: 2560x1440 QHD",
          "Frecuencia: 165Hz",
          "Tecnología: NVIDIA G-Sync",
          "Tiempo de respuesta: 1ms",
        ],
      },
    ];

    for (const item of actualizaciones) {
      await Producto.findOneAndUpdate(
        { nombre: item.nombre },
        { $set: { especificaciones: item.especificaciones } },
        { new: true }
      );
    }

    res.status(200).json({ mensaje: "Especificaciones actualizadas correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar especificaciones", error: error.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  cargarEspecificaciones,
};
