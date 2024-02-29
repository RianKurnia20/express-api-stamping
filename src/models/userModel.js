// models/userModel.js
const dbPool = require('../config/database');
const bcrypt = require('bcrypt');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const createUser = async (username, email, hashedPassword) => {
  await runQuery(`INSERT INTO users (username, email, password, roles) VALUES (?, ?, ?, 'viewer')`, [username, email, hashedPassword]);
  return true;
};

const updateUserById = async (userId, userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi kata sandi baru
  // Perbarui data pengguna di database
  await runQuery('UPDATE users SET username = ?, email = ?, password = ? WHERE id_user = ?', [username, email, hashedPassword, userId]);
  return true; // Jika berhasil memperbarui pengguna
};

const getAllUsers = async () => {
  return await runQuery('SELECT id_user,username,email,created_at,updated_at,deleted_at FROM users where deleted_at is null');
};

const deleteUserById = async (userId) => {
  const currentTime = new Date().toISOString();
  await dbPool.query('UPDATE users SET deleted_at = ? WHERE id_user = ?', [currentTime, userId]);
  return true; // Kembalikan true jika pengguna berhasil dihapus
};

const findUserByUsername = async (username) => {
  return await runQuery('SELECT * FROM users WHERE username = ? and deleted_at is null', [username]);
};

const findUserByEmail = async (email) => {
  return await runQuery('SELECT * FROM users WHERE email = ?', [email]);
};

const findUserById = async (userId) => {
    return await runQuery('SELECT username,email,roles FROM users WHERE id_user = ?', [userId]);
};

module.exports = {
  createUser,
  updateUserById,
  getAllUsers,
  deleteUserById,
  findUserByUsername,
  findUserByEmail,
  findUserById
};
