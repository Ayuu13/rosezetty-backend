const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'rosezzty',
});

const Peran = sequelize.define('peran', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
nama: {
    type: DataTypes.STRING,
    allowNull: false,
}
}, {
    tableName: 'perans',
    timestamps: false,
});

const Pengguna = sequelize.define('pengguna', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
no_akun:{
  type: DataTypes.INTEGER,
  allowNull: false,
  unique: true,
},
nama: {
    type: DataTypes.STRING,
    allowNull: false,
},
email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
},
nowa: {
    type: DataTypes.STRING,
    allowNull: false,
},
katasandi: {
    type: DataTypes.STRING,
    allowNull: false,
},
peran_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Peran',
        key: 'id',
},},
buat_akun: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
},
edit_akun: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
},}, {
    timestamps: false,
});

const Barang = sequelize.define('barang', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

const JenisProduk = sequelize.define('jenisproduk', {
id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
},
nama: {
        type: DataTypes.STRING,
        allowNull: false,
}
}, {
        tableName: 'jenisproduks',
        timestamps: false,
});

const Produk = sequelize.define('produk', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
jenis_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'JenisProduk',
    key: 'id',
  },
},
barang_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
      model: 'Barang',
      key: 'id',
},},
nama: {
    type: DataTypes.STRING,
    allowNull: false,
},
detail: {
    type: DataTypes.TEXT,
    allowNull: false,
},
tutup_pesanan: {
    type: DataTypes.DATE,
},
dibuat: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
},
}, {
  timestamps: false,
});

const SistemBayar = sequelize.define('sistembayar', {
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
    },
    nama: {
            type: DataTypes.STRING,
            allowNull: false,
    }
    }, {
            tableName: 'sistembayars',
            timestamps: false,
});

const ProdukVersi = sequelize.define('versiproduk', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  produk_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Produk',
      key: 'id',
    },
  },
  versi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sistembayar_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SistemBayar',
      key: 'id',
    },
  },
}, {
  timestamps: false,
});

const Status = sequelize.define('status', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

const MetodeBayar = sequelize.define('metodebayar', {
  id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
  },
  nama: {
          type: DataTypes.STRING,
          allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
  }, {
          tableName: 'metodebayars',
          timestamps: false,
});

const Pesanan = sequelize.define('pesanan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  no_pesanan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pengguna_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pengguna,
      key: 'id',
    },
  },
  total_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  harga_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  waktu_bayar: {
    type: DataTypes.DATE,
  },
  waktu_pesan: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  metode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'MetodeBayar',
      key: 'id',
    },
  },
  jumlah_bayar: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Status',
      key: 'id',
    },
  },
}, {
  timestamps: false,
});

const PesananDetail = sequelize.define('pesanandetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pesanan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pesanan,
      key: 'id',
    },
  },
  versiproduk_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProdukVersi,
      key: 'id',
    },
  },
  jumlah_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  }, {
  timestamps: false,
});

const Testimoni = sequelize.define('testimoni', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pesanan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pesanan',
      key: 'id',
    },
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dibuat: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
},
}, {
  timestamps: false,
});

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
});

// Mendefinisikan asosiasi
Pengguna.belongsTo(Peran, { foreignKey: 'peran_id' });
Peran.hasMany(Pengguna, { foreignKey: 'peran_id' });

Produk.belongsTo(Barang, { foreignKey: 'barang_id' });
Barang.hasMany(Produk, { foreignKey: 'barang_id' });
Produk.belongsTo(JenisProduk, { foreignKey: 'jenis_id' });
JenisProduk.hasMany(Produk, { foreignKey: 'jenis_id' });
ProdukVersi.belongsTo(Produk, { foreignKey: 'produk_id' });
Produk.hasMany(ProdukVersi, { foreignKey: 'produk_id' });
ProdukVersi.belongsTo(SistemBayar, { foreignKey: 'sistembayar_id' });
SistemBayar.hasMany(ProdukVersi, { foreignKey: 'sistembayar_id' });

Pesanan.belongsTo(Pengguna, { foreignKey: 'pengguna_id' });
Pengguna.hasMany(Pesanan, { foreignKey: 'pengguna_id' });
Pesanan.belongsTo(MetodeBayar, { as: 'metodebayar', foreignKey: 'metode_id' });
MetodeBayar.hasMany(Pesanan, { as: 'pesanan', foreignKey: 'metode_id' });
Pesanan.belongsTo(Status, { as: 'status', foreignKey: 'status_id' });
Status.hasMany(Pesanan, { as: 'pesanan', foreignKey: 'status_id' });

PesananDetail.belongsTo(Pesanan, { as: 'pesanan', foreignKey: 'pesanan_id' });
Pesanan.hasMany(PesananDetail, { as: 'pesanandetail', foreignKey: 'pesanan_id' });
PesananDetail.belongsTo(ProdukVersi, { as: 'produkVersi', foreignKey: 'versiproduk_id' });
ProdukVersi.hasMany(PesananDetail, { as: 'pesanandetail', foreignKey: 'versiproduk_id' });


// Model Testimoni
Testimoni.belongsTo(Pesanan, { as: 'pesanan', foreignKey: 'pesanan_id' });
Pesanan.hasMany(Testimoni, { foreignKey: 'pesanan_id' });



sequelize.sync();
module.exports = { sequelize, Peran, Pengguna, JenisProduk, Produk, SistemBayar, ProdukVersi,
  Barang, Status, Pesanan, PesananDetail, MetodeBayar, Testimoni, TokenBlacklist
};