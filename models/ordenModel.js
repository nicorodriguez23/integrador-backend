const mongoose = require("mongoose");

const ordenSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    default: "pendiente",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Orden", ordenSchema);
