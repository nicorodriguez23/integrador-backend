const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso solo para administradores" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
