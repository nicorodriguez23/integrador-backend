const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB correctamente");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error);
  });


app.get("/", (req, res) => {
  res.send("¡Bienvenido al backend del integrador!");
});

const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");
const ordenRoutes = require("./routes/ordenRoutes");

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/ordenes", ordenRoutes);
