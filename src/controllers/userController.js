
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {  
    res.status(status).json({ message });
  };
}

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const createNewUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleResponse(res, errors.array(), 400)
    // return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Cek apakah pengguna dengan email yang sama sudah ada dalam database
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser[0]) {
      return handleResponse(res, 'Email already exists', 400);
    }

    // Enkripsi kata sandi sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru ke database
    await userModel.createUser(username, email, hashedPassword);

    // Ambil data user untuk generate payload token JWT
    const dataUser = await userModel.findUserByUsername(username)
    if(!dataUser){
      return handleResponse(res, 'Authentication failed', 401);
    }

    // Buat payload untuk token JWT
    const payload = { id_user: dataUser[0].id_user, password: dataUser[0].password, role: dataUser[0].roles };

    // Variabel setting expired token
    const expiresIn = 60*60*1

    // Buat token JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn }, (err, token) => {
      if (err) {
        throw err;
      }
      // Kirim token sebagai respons
      res.json({ token });
    });
  } catch (error) {
    handleError(res, error)
  }
};

const changePassword = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const { old_password, new_password } = req.body 
  if (!token) {
    return handleResponse(res, 'Token not found', 401)
  }
  if(!old_password || !new_password) {
    return handleResponse(res, 'All fields are required', 400)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // Check user data pada table database
    const checkUser = await userModel.findUserById(decoded.id_user)
    if(!checkUser[0]){
      return handleResponse(res, 'User id not found', 404)
    }

    const passwordMatch = await bcrypt.compare(old_password, checkUser[0].password);
    if (!passwordMatch) {
      return handleResponse(res, 'Old password wrong', 401)
    }
    // Lakukan update jika semua validasi sudah lewat
    await userModel.updateUserById(decoded.id_user, new_password);
    handleResponse(res, 'Change password success')
  } catch (error) {
    handleError(res, error)
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const data = users.length === 0 ? 'No users data available' : users
    handleResponse(res, 'Success', 200, data)
  } catch (error) {
    handleError(res, error)
  }
};

const deleteUser = async (req, res) => {
  try {
    const checkUser = await userModel.findUserById(req.params.id)
    if(!checkUser[0]){
      return handleResponse(res, 'User with id: '+req.params.id+' is not found', 404)
    }
    const deleted = await userModel.deleteUserById(req.params.id);
    const message = deleted ? 'User deleted successfully' : 'User not found';
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.params.id)
    const data = user.length === 0 ? 'User not found' : user
    handleResponse(res, 'Success', 200, data)
  } catch (error) {
    handleError(res, error)
  }
}


module.exports = {
  createNewUser,
  changePassword,
  deleteUser,
  getAllUsers,
  getUserById
};
