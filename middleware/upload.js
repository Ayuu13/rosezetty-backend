const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Direktori untuk menyimpan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Penamaan file
  }
});

// Filter untuk memeriksa jenis file
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Batas ukuran file
  fileFilter: fileFilter
});

module.exports = upload;
