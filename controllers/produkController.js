const { JenisProduk, Barang, Produk, ProdukVersi, SistemBayar  } = require('../database');

exports.getJenisPro = async (req, res) => {
  try {
    console.log('getJenisPro dipanggil');
    const jenisproduk = await JenisProduk.findAll();
    res.status(200).json(jenisproduk);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addJenisPro = async (req, res) => {
const { nama } = req.body;

try {
  // Periksa apakah produk dengan nama yang sama sudah ada
  const existingJenisPro = await JenisProduk.findOne({ where: { nama } });
  if (existingJenisPro) {
    return res.status(400).json({ message: 'Jenis Produk sudah ada' });
  }

  // Tambahkan produk baru
  const jenispro = await JenisProduk.create({
    nama
  });

  res.status(201).json({
    message: 'Jenis Produk berhasil ditambahkan',
    jenispro,
  });

} catch (error) {
  console.error('Error adding jenis produk:', error);
  res.status(500).json({ message: 'Internal server error' });
}
};

exports.deleteJenisPro = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari jenis produk berdasarkan ID
    const jenisPro = await JenisProduk.findByPk(id);

    if (!jenisPro) {
      return res.status(404).json({ message: 'Jenis Produk tidak ditemukan' });
    }

    // Hapus jenis produk
    await jenisPro.destroy();

    res.status(200).json({ message: 'Jenis Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting jenis produk:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProduk = async (req, res) => {
  try {
    const produk = await Produk.findAll({
      include: [
        { model: Barang, attributes: ['nama'] },
        { model: JenisProduk, attributes: ['nama'] }
      ]
    });
    res.status(200).json(produk);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProdukById = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await Produk.findAll({
      where: { id },
      include: [
        { model: Barang, attributes: ['nama'] },
        { model: JenisProduk, attributes: ['nama'] }
      ]
    });

    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json(produk);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addProduk = async (req, res) => {
  const { jenis_id, nama, detail, tutup_pesanan } = req.body;

  const barang_id = req.body.barang_id || 1;
  
  try {
    const produk = await Produk.create({
      jenis_id, barang_id, nama, detail, tutup_pesanan
    });

    res.status(201).json({
      message: 'Produk berhasil ditambahkan',
      produk,
    });
  } catch (error) {
    console.error('Error adding Produk:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProduk = async (req, res) => {
  const { id } = req.params;
  const { jenis_id, barang_id, nama, detail, tutup_pesanan } = req.body;

  try {
    const produk = await Produk.findByPk(id);
    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Perbarui data produk
    produk.jenis_id = jenis_id || produk.jenis_id;
    produk.barang_id = barang_id || produk.barang_id;
    produk.nama = nama || produk.nama;
    produk.detail = detail || produk.detail;
    produk.tutup_pesanan = tutup_pesanan || produk.tutup_pesanan;

    // Simpan perubahan
    await produk.save();

    res.status(200).json({
      message: 'Produk berhasil diperbarui',
      produk,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProVersi = async (req, res) => {
  try {
    const produkVersi = await ProdukVersi.findAll({
      include: [
        { model: Produk, attributes: ['nama', 'detail', 'barang_id'],
          include: {
            model: Barang,
            as: 'barang',
            attributes: ['nama']
          }
        },
        { model: SistemBayar, attributes: ['nama'] }
      ]
    });
    res.status(200).json(produkVersi);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProVersiById = async (req, res) => {
  const { id } = req.params;

  try {
    const produkVersi = await ProdukVersi.findAll({
      where: { id },
      include: [
        { model: Produk, attributes: ['nama', 'detail'] },
        { model: SistemBayar, attributes: ['nama'] }
      ]
    });

    if (!produkVersi.length) {
      return res.status(404).json({ message: 'Produk versi tidak ditemukan' });
    }

    res.status(200).json(produkVersi);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProVersiByProdukId = async (req, res) => {
  const { produk_id } = req.params;

  try {
    const produkVersi = await ProdukVersi.findAll({
      where: { produk_id },
      include: [
        {
          model: Produk,
          as: 'produk',
          include: [
            { model: Barang, as: 'barang', attributes: ['nama'] },
          ],
        },
        { model: SistemBayar, attributes: ['nama'] }
      ],
    });

    if (!produkVersi.length) {
      return res.status(404).json({ message: 'Produk versi tidak ditemukan' });
    }

    res.status(200).json(produkVersi);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addProVersi = async (req, res) => {
  const { produk_id, versi, harga, sistembayar_id } = req.body;
  let gambar = null;
  if (req.file) {
    gambar = req.file.filename;
  }

  try {
    const produk = await ProdukVersi.create({
      produk_id,
      versi,
      harga,
      gambar,
      sistembayar_id
    });

    res.status(201).json({
      message: 'Varian Produk berhasil ditambahkan',
      produk,
    });
  } catch (error) {
    console.error('Error adding Varian Produk:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProVersi = async (req, res) => {
  const { id } = req.params;
  const { produk_id, versi, harga, sistembayar_id } = req.body;
  let gambar = null;
  if (req.file) {
    gambar = req.file.filename;
  }

  try {
    const prover = await ProdukVersi.findByPk(id);
    if (!prover) {
      return res.status(404).json({ message: 'Varian Produk tidak ditemukan' });
    }

    // Update hanya jika nilai yang dikirimkan tidak null atau undefined
    if (produk_id !== undefined && produk_id !== null) {
      prover.produk_id = produk_id;
    }
    if (versi !== undefined && versi !== null) {
      prover.versi = versi;
    }
    if (harga !== undefined && harga !== null) {
      prover.harga = harga;
    }
    if (sistembayar_id !== undefined && sistembayar_id !== null) {
      prover.sistembayar_id = sistembayar_id;
    }
    if (gambar) {
      prover.gambar = gambar;
    }
    
    await prover.save();

    res.status(200).json({
      message: 'Varian Produk berhasil diperbarui',
      prover,
    });
  } catch (error) {
    console.error('Error updating Varian Produk:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProVersi = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await ProdukVersi.findByPk(id);

    if (!produk) {
      return res.status(404).json({ message: 'Produk Versi tidak ditemukan' });
    }

    await produk.destroy();

    res.status(200).json({ message: 'Produk Versi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting Produk Versi:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};