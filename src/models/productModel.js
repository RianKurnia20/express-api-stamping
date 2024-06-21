const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addProduct = async (id, name, price) => {
  await runQuery(`INSERT INTO product (id_product, name, price) VALUES (?, ?, ?)`, [id, name, price]);
  return true; // Jika berhasil menyimpan pengguna
};

const updateProductById = async (id, productData) => {
  const { id_product, name, price } = productData;
  await runQuery(`UPDATE product SET id_product = ?, name = ?, price = ? WHERE id_product = ?`, [id_product, name, price, id]);
  return true
}

const findProductById = async (id) => {
  return await runQuery('SELECT id_product, name FROM product WHERE id_product = ?', [id]);
}

const getAllProduct = async () => {
  return await runQuery('SELECT * from product where deleted_at is null ORDER BY name asc')
}

const deleteProductByid = async (id) => {
    const currentTime = new Date().toISOString();
    await runQuery('UPDATE product SET deleted_at = ? WHERE id_product = ?', [currentTime, id]);

    // delete query testing (not implemented)
    // await runQuery('DELETE FROM product WHERE id_product = ?', [id]);

    return true; // Kembalikan true jika pengguna berhasil dihapus
};

module.exports = {
  addProduct,
  updateProductById,
  findProductById,
  getAllProduct,
  deleteProductByid
}