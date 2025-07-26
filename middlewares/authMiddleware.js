const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; 
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado: se requiere rol de administrador" });
  }
  next();
};

module.exports = {
  verificarToken,
  verificarAdmin,
};
