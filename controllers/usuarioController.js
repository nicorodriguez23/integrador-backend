const Usuario = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = async (req, res) => {
  try {
    console.log("🟢 Datos que llegan del frontend:", req.body);

    const { nombre, email, password, rol, fechaNacimiento, provincia, observacion } = req.body;

    if (!nombre || !email || !password || !fechaNacimiento || !provincia) {
      return res.status(400).json({ mensaje: "Todos los campos obligatorios deben ser completados" });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const fechaNacimientoDate = new Date(fechaNacimiento);
    if (isNaN(fechaNacimientoDate.getTime())) {
      return res.status(400).json({ mensaje: "La fecha de nacimiento no es válida" });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || "cliente",
      fechaNacimiento: fechaNacimientoDate,
      provincia,
      observacion,
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ mensaje: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil", error: error.message });
  }
};
