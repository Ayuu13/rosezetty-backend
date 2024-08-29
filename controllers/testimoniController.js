const { Testimoni, Pesanan, PesananDetail, ProdukVersi, Produk } = require('../database');

exports.getTestimoni = async (req, res) => {
  try {
    const testimoni = await Testimoni.findAll({
      include: [
        {
          model: Pesanan,
          as: 'pesanan',
          include: [
            {
              model: PesananDetail,
              as: 'pesanandetail',
              include: [
                {
                  model: ProdukVersi,
                  as: 'produkVersi',
                  attributes: ['produk_id', 'versi'],
                  include: [
                    { model: Produk, attributes: ['nama'] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    console.log(testimoni);
    if (!testimoni.length) {
      return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
    }
    res.status(200).json(testimoni);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTestimoniById = async (req, res) => {
  const { id } = req.params;
  try {
    const testimoni = await Testimoni.findAll({
      where: { id },
      include: [
        { model: Pesanan, as: 'pesanan', attributes: ['no_pesanan'] }
      ]
    });
    console.log(testimoni);
    if (!testimoni.length) {
      return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
    }
    res.status(200).json(testimoni);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTestimoniByPesananId = async (req, res) => {
  const { pesanan_id } = req.params;
  try {
    const testimoni = await Testimoni.findAll({
      where: { pesanan_id },
      include: [
        {
          model: Pesanan,
          as: 'pesanan',
          include: [
            {
              model: PesananDetail,
              as: 'pesanandetail',
              where: { pesanan_id }, // Filter PesananDetail berdasarkan pesanan_id
              include: [
                {
                  model: ProdukVersi,
                  as: 'produkVersi',
                  attributes: ['produk_id', 'versi'],
                  include: [
                    { model: Produk, attributes: ['nama'] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    console.log(testimoni);
    if (!testimoni.length) {
      return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
    }
    res.status(200).json(testimoni);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addTestimoni = async (req, res) => {
  const { pesanan_id, keterangan } = req.body;
  const gambar = req.file ? req.file.filename : null; // Dapatkan nama file yang diunggah

  try {
    // Periksa apakah testimoni dengan pesanan_id yang sama sudah ada
    const existingTestimoni = await Testimoni.findOne({ where: { pesanan_id } });
    if (existingTestimoni) {
      return res.status(400).json({ message: 'Testimoni untuk pesanan ini sudah ada' });
    }

    // Tambahkan testimoni baru
    const testimoni = await Testimoni.create({
      pesanan_id, keterangan, gambar
    });

    res.status(201).json({
      message: 'Testimoni berhasil ditambahkan',
      testimoni: {
        id: testimoni.id,
        pesanan_id: testimoni.pesanan_id,
        keterangan: testimoni.keterangan,
        gambar: testimoni.gambar
      }
    });

  } catch (error) {
    console.error('Error adding testimoni:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTestimoni = async (req, res) => {
  const { id } = req.params;
  const { keterangan, dibuat } = req.body;
  let gambar = null;
  if (req.file) {
    gambar = req.file.filename;
  }
  try {
    const testi = await Testimoni.findByPk(id);
    if (!testi) {
      return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
    }

    // Update hanya jika nilai yang dikirimkan tidak null atau undefined
    if (keterangan !== undefined && keterangan !== null) {
      testi.keterangan = keterangan;
    }
    if (dibuat !== undefined && dibuat !== null) {
      testi.dibuat = dibuat;
    }
    if (gambar) {
      testi.gambar = gambar;
    }
    
    await testi.save();

    res.status(200).json({
      message: 'Testimoni berhasil diperbarui',
      testi,
    });
  } catch (error) {
    console.error('Error updating Testimoni:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
