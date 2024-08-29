const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { authenticateToken } = require('../middleware/auth');

// Konfigurasi multer untuk menyimpan file di direktori 'upload'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const { getUserById, getAllPeran, addPeran, getSistemBayar, addSistemBayar, getStaPesan, addStaPesan, getStaBarang, addStaBarang } = require('../controllers/peranController');
const { getUsers, registerUser, loginUser, logoutUser, updateUser } = require('../controllers/authController');
const { getJenisPro, addJenisPro, deleteJenisPro, getAllProduk, getProdukById, addProduk, updateProduk,
    getAllProVersi, getProVersiById, getProVersiByProdukId, addProVersi, updateProVersi, deleteProVersi } = require('../controllers/produkController');
const { getMetodeBayar, getMetodeBayarById, addMetodeBayar, updateMetodeBayar, getPesanan, getPesananJumlah, getTotalPesananById, getTotalPesanan, 
  getPesananById, getPesananByPesananId, getPesananByPenggunaId, addPesanan, updatePesanan } = require('../controllers/pesananController');
const { getTestimoni, getTestimoniById, getTestimoniByPesananId, addTestimoni, updateTestimoni } = require('../controllers/testimoniController');

router.get('/peran-all', getAllPeran);
router.post('/peran/tambah', addPeran);
 
router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.post('/logout', logoutUser);

router.post('/register', registerUser);
router.post('/masuk', loginUser);
router.put('/akun-edit/:id', updateUser);

router.get('/jenis-produk', getJenisPro);
router.post('/jenis-produk/tambah', addJenisPro);
router.delete('/jenis-produk/:id', deleteJenisPro);

router.get('/produk', getAllProduk);
router.get('/produk/:id', getProdukById );
router.post('/produk/tambah', authenticateToken, addProduk);
router.put('/produk/edit/:id', authenticateToken, updateProduk);

router.get('/sistem-bayar', getSistemBayar);
router.post('/sistem-bayar/tambah', addSistemBayar);
router.get('/status-pesanan', getStaPesan);
router.post('/status-pesanan/tambah', addStaPesan);
router.get('/status-barang', getStaBarang);
router.post('/status-barang/tambah', addStaBarang);

router.get('/varian-produk', getAllProVersi);
router.get('/varian-detail/:id', getProVersiById );
router.get('/varian/:produk_id', getProVersiByProdukId );
router.post('/varian-produk/tambah', upload.single('gambar'), authenticateToken, addProVersi);
router.put('/varian-produk/edit/:id', upload.single('gambar'), authenticateToken, updateProVersi);
router.delete('/varian-produk/:id', authenticateToken, deleteProVersi);

router.get('/pesanan', getPesanan);
router.get('/jumlah-pesanan', getPesananJumlah);
router.get('/total-pesan/:produk_id', getTotalPesananById);
router.get('/pesanan-total/:versiproduk_id', getTotalPesanan);
router.get('/pesanan/:id', authenticateToken, getPesananById);
router.get('/pesanan-detail/:pesanan_id', getPesananByPesananId);
router.get('/riwayat-pesanan/:pengguna_id', authenticateToken, getPesananByPenggunaId);
router.post('/pesanan/tambah', upload.single('gambar'), authenticateToken, addPesanan);
router.put('/pesanan/edit/:id', authenticateToken, updatePesanan);

router.get('/metode-bayar', getMetodeBayar);
router.get('/metode-bayar/:id', getMetodeBayarById);
router.post('/metode-bayar/tambah', authenticateToken, upload.single('gambar'), addMetodeBayar);
router.put('/metode-bayar/edit/:id', authenticateToken, upload.single('gambar'), updateMetodeBayar);

router.get('/testimoni', getTestimoni);
router.get('/testimoni/:id', getTestimoniById);
router.get('/testimoni-pesan/:pesanan_id', getTestimoniByPesananId);
router.post('/testimoni/tambah', authenticateToken, upload.single('gambar'), addTestimoni);
router.put('/testimoni/edit/:id', authenticateToken, upload.single('gambar'), updateTestimoni);

module.exports = router;