const dbPool = require('../config/database')

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addPca = async (id_machine, id_product, id_kanagata, speed) => {
  await runQuery('INSERT INTO pca (id_machine, id_product, id_kanagata, speed) VALUES (?, ?, ?, ?, ?)', [id_machine, id_product, id_kanagata, speed]);
  return true;
};

const getAllPca = async () => {
  return await runQuery(`
  SELECT pca.id_pca, pca.id_machine, pca.id_product, pca.id_kanagata, pca.speed, pca.created_at, pca.updated_at, product.name as name
  FROM pca
  JOIN product ON pca.id_product = product.id_product
  WHERE pca.deleted_at is null
  ORDER BY pca.id_machine`
  )
}

const updatePcaById = async (id_pca, pcaData) => {
  const { id_machine, id_product, id_kanagata, speed } = pcaData
  await runQuery(
    'UPDATE pca SET id_machine = ?, id_product = ?, id_kanagata = ?, speed = ? WHERE id_pca = ?',
    [id_machine, id_product, id_kanagata, speed, id_pca]
    )
  return true
}

const deletePcaById = async (id) => {
  const currentTime = new Date().toISOString();
  await runQuery('UPDATE pca SET deleted_at = ? WHERE id_pca = ?', [currentTime, id]);
  return true;
};

const getPcaByIdProduct = async (id_product) => {
  return await runQuery(`
  SELECT *, product.name as name
  FROM pca
  JOIN product ON pca.id_product = product.id_product
  WHERE product.id_product = ?`, [id_product])
}

module.exports = {
  getAllPca,
  updatePcaById,
  deletePcaById,
  addPca,
  getPcaByIdProduct
}