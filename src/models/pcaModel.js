const dbPool = require('../config/database')

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addPca = async (id_machine, id_product, id_kanagata, speed) => {
  await runQuery('INSERT INTO pca (id_machine, id_product, id_kanagata, speed) VALUES (?, ?, ?, ?)', [id_machine, id_product, id_kanagata, speed]);
  return true;
};

const getAllPca = async () => {
  return await runQuery('SELECT * FROM pca WHERE deleted_at IS NULL')
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


module.exports = {
  getAllPca,
  updatePcaById,
  deletePcaById,
  addPca
}