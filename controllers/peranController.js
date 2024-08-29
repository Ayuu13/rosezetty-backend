const { Pengguna, Peran, SistemBayar, Status, Barang } = require('../database');

exports.getUserById = async (req, res) => {
  const { id } = req.params;
 
  try {
    const users = await Pengguna.findByPk(id);

    if (!users) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllPeran = async (req, res) => {
  try {
    const perans = await Peran.findAll();
    res.status(200).json(perans);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addPeran = async (req, res) => {
    const { nama } = req.body;
  
    try {
      // Periksa apakah produk dengan nama yang sama sudah ada
      const existingPeran = await Peran.findOne({ where: { nama } });
      if (existingPeran) {
        return res.status(400).json({ message: 'Peran sudah ada' });
      }
  
      // Tambahkan produk baru
      const peran = await Peran.create({
        nama,
      });
  
      res.status(201).json({
        message: 'Peran berhasil ditambahkan',
        peran,
      });
  
    } catch (error) {
      console.error('Error adding peran:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getSistemBayar = async (req, res) => {
  try {
    const sistembayar = await SistemBayar.findAll();
    res.status(200).json(sistembayar);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addSistemBayar = async (req, res) => {
    const { nama } = req.body;
  
    try {
      // Periksa apakah produk dengan nama yang sama sudah ada
      const existingSistemBayar = await SistemBayar.findOne({ where: { nama } });
      if (existingSistemBayar) {
        return res.status(400).json({ message: 'Sistem Bayar sudah ada' });
      }
  
      // Tambahkan produk baru
      const sistembayar = await SistemBayar.create({
        nama,
      });
  
      res.status(201).json({
        message: 'Sistem Bayar berhasil ditambahkan',
        sistembayar,
      });
  
    } catch (error) {
      console.error('Error adding Sistem Bayar:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStaPesan = async (req, res) => {
  try {
    const stapesan = await Status.findAll();
    res.status(200).json(stapesan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addStaPesan = async (req, res) => {
    const { nama } = req.body;
  
    try {
      // Periksa apakah produk dengan nama yang sama sudah ada
      const existingStaPesan = await Status.findOne({ where: { nama } });
      if (existingStaPesan) {
        return res.status(400).json({ message: 'Status Pesanan sudah ada' });
      }
  
      // Tambahkan produk baru
      const stapesan = await Status.create({
        nama,
      });
  
      res.status(201).json({
        message: 'Status Pesanan berhasil ditambahkan',
        stapesan,
      });
  
    } catch (error) {
      console.error('Error adding Status Pesanan:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStaBarang = async (req, res) => {
  try {
    const stabarang = await Barang.findAll();
    res.status(200).json(stabarang);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addStaBarang = async (req, res) => {
    const { nama } = req.body;
  
    try {
      // Periksa apakah produk dengan nama yang sama sudah ada
      const existingStaBarang = await Barang.findOne({ where: { nama } });
      if (existingStaBarang) {
        return res.status(400).json({ message: 'Status Barang sudah ada' });
      }
  
      // Tambahkan produk baru
      const stabarang = await Barang.create({
        nama,
      });
  
      res.status(201).json({
        message: 'Status Barang berhasil ditambahkan',
        stabarang,
      });
  
    } catch (error) {
      console.error('Error adding Status Barang:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};