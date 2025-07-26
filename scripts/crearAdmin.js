const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Usuario = require("../models/usuarioModel");

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const emailAdmin = "admin@neonbyte.com";

    const usuarioExistente = await Usuario.findOne({ email: emailAdmin });
    if (usuarioExistente) {
      console.log("🟡 El usuario admin ya existe");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const nuevoAdmin = new Usuario({
      nombre: "Administrador",
      email: emailAdmin,
      password: hashedPassword,
      rol: "admin",
      fechaNacimiento: new Date("1990-01-01"),
      provincia: "Buenos Aires",
      observacion: "Usuario creado automáticamente",
    });

    await nuevoAdmin.save();
    console.log("✅ Usuario admin creado con éxito");
  } catch (error) {
    console.error("❌ Error al crear admin:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

crearAdmin();
