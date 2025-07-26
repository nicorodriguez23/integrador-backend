const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  imagen: {
    type: String,
    default: "", 
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
  },

  especificaciones: {
  type: [String], 
  default: [],
},

}, {
  timestamps: true,
});

module.exports = mongoose.model("Producto", productoSchema);
