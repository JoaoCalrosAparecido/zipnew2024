const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Diretório onde as imagens serão armazenadas
        cb(null, './app/public/IMG/uploads/');  // Diretório da imagem
    },
    filename: function (req, file, cb) {
        // Nome do arquivo com um timestamp para evitar conflitos de nome
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Middleware do multer
const upload = multer({ storage: storage });

module.exports = upload;
