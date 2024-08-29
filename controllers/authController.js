const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pengguna, TokenBlacklist } = require('../database');
require('dotenv').config();
const generateRandomAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const getUsers = async (req, res) => {
  try {
    const users = await Pengguna.findAll();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

const registerUser = async (req, res) => {
  const { nama, email, nowa, katasandi, peran_id } = req.body;

  try {
    let no_akun;
    let isUnique = false;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(katasandi, salt);

    // Generate a unique account number
    while (!isUnique) {
      no_akun = generateRandomAccountNumber();
      const existingUser = await Pengguna.findOne({ where: { no_akun } });
      if (!existingUser) {
        isUnique = true;
      }
    }

    const newUser = await Pengguna.create({
      no_akun,
      nama,
      email,
      nowa,
      katasandi: hashedPassword,
      peran_id,
    });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, katasandi } = req.body;

  try {
    const user = await Pengguna.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Email tidak terdaftar" });
    }

    const isMatch = await bcrypt.compare(katasandi, user.katasandi);

    if (isMatch) {
      const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });
      return res.json({ success: true, accessToken, user: { id: user.id, email: user.email, nama: user.nama, peran_id: user.peran_id } });
    } else {
      return res.status(401).json({ success: false, message: "Kata Sandi salah" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const logoutUser = (req, res) => {
  // Implementasi logout user
  res.status(200).json({ message: 'Logged out successfully' });
};

const updateUser = async (req, res) => {
  const { nama, nowa, katasandi } = req.body;
  const { id } = req.params;

  try {
    const user = await Pengguna.findByPk(id);

    if (!user) {
      return res.status(404).send('Pengguna tidak ditemukan');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(katasandi, salt);

    user.nama = nama;
    user.nowa = nowa;
    user.katasandi = hashedPassword;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { getUsers, registerUser, loginUser, updateUser, logoutUser };
