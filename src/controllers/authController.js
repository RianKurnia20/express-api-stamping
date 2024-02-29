const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ message });
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Temukan pengguna berdasarkan nama pengguna
    const user = await userModel.findUserByUsername(username);
    if (!user[0]) {
      return handleResponse(res, 'Authentication failed', 401)
    }

    // Verifikasi kata sandi
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return handleResponse(res, 'Authentication failed', 401)
    }

    // Variabel waktu expired token dalam format jam
    const expiresIn = 60 * 60 * 1

    // Buat token JWT
    const token = jwt.sign({ id_user: user[0].id_user, password: user[0].password, role: user[0].roles }, process.env.JWT_SECRET, { expiresIn: expiresIn });
    res.json({ token });

  } catch (error) {
    handleError(res, error);
  }
}

const logoutUser = (req, res) => {
  // Di sini Anda dapat menghapus token dari sisi klien
  // Misalnya, jika menggunakan aplikasi web, Anda dapat menghapus token dari local storage atau session storage
  // Jika menggunakan aplikasi mobile, Anda dapat menghapus token dari penyimpanan aman yang digunakan
  // Di sini, untuk tujuan contoh, kita anggap token dihapus dari header Authorization

  handleResponse(res, 'Logout Success')
}

module.exports = {
  loginUser,
  logoutUser
}