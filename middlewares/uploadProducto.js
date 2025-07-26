const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, "uploads/products");
},
filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
},
});

const uploadProducto = multer({
storage: storage,
fileFilter: (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const ext = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mime = tiposPermitidos.test(file.mimetype);
    if (ext && mime) {
    cb(null, true);
    } else {
    cb(new Error("Solo se permiten imágenes"));
    }
},
});

module.exports = uploadProducto;
