const Usuario = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Registrar nuevo usuario (registro normal o desde admin)
exports.registrarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      rol = "cliente",
      fechaNacimiento,
      provincia,
      observacion,
    } = req.body;

    if (!nombre || !email || !password || !fechaNacimiento) {
      return res.status(400).json({ mensaje: "Todos los campos obligatorios deben ser completados" });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol,
      fechaNacimiento,
      provincia,
      observacion,
    });

    await nuevoUsuario.save();

    const usuarioSinPassword = nuevoUsuario.toObject();
    delete usuarioSinPassword.password;

    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
};

// Login
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

// Obtener perfil del usuario autenticado
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

// 🔒 Obtener todos los usuarios (solo admin)
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
};

// 🔒 Actualizar usuario (solo admin)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, fechaNacimiento, rol } = req.body;

    const datosActualizados = {
      nombre,
      email,
      fechaNacimiento,
      rol,
    };

    if (password) {
      datosActualizados.password = await bcrypt.hash(password, 10);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true }
    ).select("-password");

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario", error: error.message });
  }
};

// 🔒 Eliminar usuario (solo admin)
exports.eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message });
  }
};
