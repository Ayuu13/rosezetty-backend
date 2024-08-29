const { v4: uuidv4 } = require('uuid');
const { Pengguna, MetodeBayar, ProdukVersi, Produk, SistemBayar, Barang, Status, Pesanan, PesananDetail, sequelize } = require('../database');

exports.getMetodeBayar = async (req, res) => {
  try {
    const metodebayar = await MetodeBayar.findAll();
    res.status(200).json(metodebayar);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMetodeBayarById = async (req, res) => {
  const { id } = req.params;

  try {
    const metodebayar = await MetodeBayar.findByPk(id);

    if (!metodebayar) {
      return res.status(404).json({ message: 'metode bayar tidak ditemukan' });
    }

    res.status(200).json(metodebayar);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addMetodeBayar = async (req, res) => {
    const { nama, keterangan } = req.body;
    let gambar = null;
    if (req.file) {
      gambar = req.file.filename;
  }
  
    try {
      // Periksa apakah produk dengan nama yang sama sudah ada
      const existingMetodeBayar = await MetodeBayar.findOne({ where: { nama } });
      if (existingMetodeBayar) {
        return res.status(400).json({ message: 'Sistem Bayar sudah ada' });
      }
  
      // Tambahkan produk baru
      const metodebayar = await MetodeBayar.create({
        nama, keterangan, gambar
      });
  
      res.status(201).json({
        message: 'Metode Bayar berhasil ditambahkan',
        metodebayar,
      });
  
    } catch (error) {
      console.error('Error adding Metode Bayar:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateMetodeBayar = async (req, res) => {
  const { id } = req.params;
  const { nama, keterangan } = req.body;
  let gambar = null;
  if (req.file) {
    gambar = req.file.filename;
  }

  try {
    // Temukan metode bayar berdasarkan ID
    const metodebayar = await MetodeBayar.findByPk(id);

    if (!metodebayar) {
      return res.status(404).json({ message: 'Metode Bayar tidak ditemukan' });
    }

    // Perbarui metode bayar
    await metodebayar.update({
      nama: nama || metodebayar.nama,
      keterangan: keterangan || metodebayar.keterangan,
      gambar: gambar || metodebayar.gambar,
    });

    res.status(200).json({
      message: 'Metode Bayar berhasil diperbarui',
      metodebayar,
    });

  } catch (error) {
    console.error('Error updating Metode Bayar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPesanan = async (req, res) => {
  try {
    const pesanan = await Pesanan.findAll({
      include: [
        { model: Pengguna, as: 'pengguna', attributes: ['no_akun'] },
        { model: MetodeBayar, as: 'metodebayar', attributes: ['nama'] },
        { model: PesananDetail, as: 'pesanandetail',
          attributes: ['jumlah_barang',],
          include: [
            { model: ProdukVersi, as: 'produkVersi',
              attributes: ['produk_id', 'versi', 'harga', 'gambar'],
              include: [
                { model: Produk, attributes: ['nama', 'detail', 'barang_id'],
                  include: 
                  { model: Barang, as: 'barang', attributes: ['nama'] }
                },
                { model: SistemBayar, attributes: ['nama'] }
              ]
            }
          ]
        },
        { model: Status, as: 'status', attributes: ['nama'] }
      ]
    });
    
    res.status(200).json(pesanan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPesananJumlah = async (req, res) => {
  const { produk_id } = req.params;

  try {
    const pesanan = await Pesanan.findAll({
      include: [
        { model: ProdukVersi, as: 'produkVersi',
          where: { produk_id }, 
          attributes: ['versi', 'produk_id', 'harga', 'gambar' ],
          include: [
            { model: SistemBayar, attributes: ['nama'] },
            { model: Produk,
              as: 'produk',
              attributes: ['nama', 'barang_id'],
              include: [
                { model: Barang, attributes: ['nama'] }
              ],
            },
          ]},
      ],
    });
    if (!pesananDetails.length) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Menghitung total jumlah barang berdasarkan versiproduk_id
    const totalPesanan = pesananDetails.reduce((acc, item) => {
      const produk_id = item.produkVersi.produk_id;
      const versiproduk_id = item.versiproduk_id;
      const jumlah_barang = item.jumlah_barang;

      if (!acc[produk_id]) {
        acc[produk_id] = {
          versi: item.produkVersi.versi,
          produk_id: item.produkVersi.produk_id,
          harga: item.produkVersi.harga,
          gambar: item.produkVersi.gambar,
          total: 0,
        };
      }

      acc[produk_id].total += jumlah_barang;

      return acc;
    }, {});

    res.status(200).json(totalPesanan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTotalPesananById = async (req, res) => {
  const { produk_id } = req.params;

  try {
    const pesananDetails = await PesananDetail.findAll({
      include: [
        { model: ProdukVersi, as: 'produkVersi',
          where: { produk_id }, 
          attributes: ['versi', 'produk_id', 'harga', 'gambar' ],
          include: [
            { model: SistemBayar, attributes: ['nama'] },
            { model: Produk,
              as: 'produk',
              attributes: ['nama', 'barang_id'],
              include: [
                { model: Barang, attributes: ['nama'] }
              ],
            },
          ]},
      ],
    });
    if (!pesananDetails.length) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Menghitung total jumlah barang berdasarkan versiproduk_id
    const totalPesanan = pesananDetails.reduce((acc, item) => {
      const produk_id = item.produkVersi.produk_id;
      const versiproduk_id = item.versiproduk_id;
      const jumlah_barang = item.jumlah_barang;

      if (!acc[produk_id]) {
        acc[produk_id] = {
          versi: item.produkVersi.versi,
          produk_id: item.produkVersi.produk_id,
          harga: item.produkVersi.harga,
          gambar: item.produkVersi.gambar,
          total: 0,
        };
      }

      acc[produk_id].total += jumlah_barang;

      return acc;
    }, {});

    res.status(200).json(totalPesanan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTotalPesanan = async (req, res) => {
  const { versiproduk_id } = req.params;

  try {
    const pesananDetails = await PesananDetail.findAll({
      where: { versiproduk_id },
      include: [
        { model: ProdukVersi, as: 'produkVersi', 
          attributes: ['versi', 'produk_id', 'harga', 'gambar' ],
          include: [
            { model: SistemBayar, attributes: ['nama'] },
            { model: Produk,
              as: 'produk',
              attributes: ['nama', 'barang_id'],
              include: [
                { model: Barang, attributes: ['nama'] }
              ],
            },
          ]},
      ],
    });
    if (!pesananDetails.length) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Menghitung total jumlah barang berdasarkan versiproduk_id
    const totalPesanan = pesananDetails.reduce((acc, item) => {
      const versiproduk_id = item.versiproduk_id;
      const jumlah_barang = item.jumlah_barang;

      if (!acc[versiproduk_id]) {
        acc[versiproduk_id] = {
          versi: item.produkVersi.versi,
          produk_id: item.produkVersi.produk_id,
          harga: item.produkVersi.harga,
          gambar: item.produkVersi.gambar,
          total: 0,
        };
      }

      acc[versiproduk_id].total += jumlah_barang;

      return acc;
    }, {});

    res.status(200).json(totalPesanan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPesananById = async (req, res) => {
  const { id } = req.params;

  try {
    const pesanan = await Pesanan.findAll({
      where: { id },
      include: [
        { model: Pengguna, as: 'pengguna', attributes: ['no_akun'] },
        { model: MetodeBayar, as: 'metodebayar', attributes: ['nama'] },
        { model: PesananDetail, as: 'pesanandetail',
          include: [
            { model: ProdukVersi, as: 'produkVersi',
              attributes: ['produk_id', 'versi', 'harga', 'gambar'],
              include: [
                { model: Produk, attributes: ['nama', 'detail', 'barang_id'],
                  include: 
                  { model: Barang, as: 'barang', attributes: ['nama'] }
                },
                { model: SistemBayar, attributes: ['nama'] }
              ]
            }
          ]
        },
        { model: Status, as: 'status', attributes: ['nama'] }
      ]
    });
    console.log(pesanan);

    if (!pesanan.length) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.status(200).json(pesanan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPesananByPesananId = async (req, res) => {
  const { pesanan_id } = req.params;

  try {
    const pesanan = await PesananDetail.findAll({
      where: { pesanan_id },
      include: [
        { model: Pesanan, as: 'pesanan', 
            attributes: ['no_pesanan','total_barang','harga_total','waktu_pesan','waktu_bayar','metode_id','jumlah_bayar','gambar','status_id','pengguna_id'],
            include: [
              { model: MetodeBayar, as: 'metodebayar', attributes: ['nama'] },
              { model: Status, as: 'status', attributes: ['nama'] },
              { model: Pengguna, as: 'pengguna', attributes: ['no_akun'] },
            ]},
        { model: ProdukVersi, as: 'produkVersi', 
          attributes: ['versi', 'produk_id', 'harga', 'gambar' ],
          include: [
            { model: SistemBayar, attributes: ['nama'] },
            { model: Produk,
              as: 'produk',
              attributes: ['nama', 'barang_id'],
              include: [
                { model: Barang, attributes: ['nama'] }
              ],
            },
          ]},
      ],
    });
    console.log(pesanan);

    if (!pesanan.length) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.status(200).json(pesanan);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPesananByPenggunaId = async (req, res) => {
  const { pengguna_id } = req.params;

  try {
    const pesanan = await Pesanan.findAll({
      where: { pengguna_id },
      include: [
        {
          model: PesananDetail,
          as: 'pesanandetail',
          include: [
            { model: ProdukVersi, as: 'produkVersi', attributes: ['produk_id', 'versi', 'gambar'] },
          ],
        },
        { model: Status, as: 'status', attributes: ['nama'] },
      ],
    });
    if (!pesanan.length) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    res.status(200).json(pesanan);
  } catch (error) {
    console.error('Error fetching pesanan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addPesanan = async (req, res) => {
  const versiproduk_ids = JSON.parse(req.body.versiproduk_ids);
  const jumlah_barang = JSON.parse(req.body.jumlah_barang);
  const { metode_id, jumlah_bayar, waktu_bayar } = req.body;
  let gambar = null;
    if (req.file) {
      gambar = req.file.filename;
  }
  console.log("Data yang diterima:", {
      versiproduk_ids,
      jumlah_barang,
      metode_id,
      jumlah_bayar,
      gambar,
      waktu_bayar
    });
  const status_id = req.body.status_id || 1;

  try {
    const pengguna_id = req.user.id;  // Dapatkan pengguna_id dari token yang terotentikasi
    const no_pesanan = uuidv4();  // Menggunakan UUID untuk menghasilkan kode pesanan unik

    // Hitung harga_total dan total_barang
    let harga_total = 0;
    let total_barang = 0;
    for (let i = 0; i < versiproduk_ids.length; i++) {
      const versiProduk = await ProdukVersi.findByPk(versiproduk_ids[i]);
      if (versiProduk) {
        console.log(`Produk versi ditemukan: ${versiproduk_ids[i]}`);
        harga_total += versiProduk.harga * jumlah_barang[i];
        total_barang += jumlah_barang[i];
      } else {
        return res.status(404).json({ message: `Produk versi dengan ID ${versiproduk_ids[i]} tidak ditemukan` });
      }
    }

    // Tambahkan pesanan ke dalam database
    const newPesanan = await Pesanan.create({
      no_pesanan,
      pengguna_id,
      status_id,
      harga_total,
      total_barang,
      waktu_bayar,
      metode_id,
      jumlah_bayar,
      gambar,
      waktu_pesan: new Date()
    });

    // Tambahkan detail pesanan ke dalam database
    for (let i = 0; i < versiproduk_ids.length; i++) {
      await PesananDetail.create({
        pesanan_id: newPesanan.id,
        versiproduk_id: versiproduk_ids[i],
        jumlah_barang: jumlah_barang[i],
      });
    }

    res.status(201).json(newPesanan);
  } catch (error) {
    console.error('Error adding pesanan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePesanan = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  try {
    // Cari produk berdasarkan ID
    const pesanan = await Pesanan.findByPk(id);
    if (!pesanan) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Perbarui data produk
    pesanan.status_id = status_id || pesanan.status_id;

    // Simpan perubahan
    await pesanan.save();

    res.status(200).json({
      message: 'Pesanan berhasil diperbarui',
      pesanan,
    });
  } catch (error) {
    console.error('Error updating Pesanan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};