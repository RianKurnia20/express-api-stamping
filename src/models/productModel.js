const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addProduct = async (id, name) => {
  await runQuery(`INSERT INTO product (id_product, name) VALUES (?, ?)`, [id, name]);
  return true; // Jika berhasil menyimpan pengguna
};

const updateProductById = async (id, productData) => {
  const { id_product, name } = productData;
  await runQuery(`UPDATE product SET id_product = ?, name = ? WHERE id_product = ?`, [id_product, name, id]);
  return true
}

const findProductById = async (id) => {
  return await runQuery('SELECT id_product, name FROM product WHERE id_product = ?', [id]);
}

const getAllProduct = async () => {
  return await runQuery('SELECT * from product where deleted_at is null')
}

const deleteProductByid = async (id) => {
    const currentTime = new Date().toISOString();
    await runQuery('UPDATE product SET deleted_at = ? WHERE id_product = ?', [currentTime, id]);
    return true; // Kembalikan true jika pengguna berhasil dihapus
};

module.exports = {
  addProduct,
  updateProductById,
  findProductById,
  getAllProduct,
  deleteProductByid
}