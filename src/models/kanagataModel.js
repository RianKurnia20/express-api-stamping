const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addKanagata = async (id, actual_shot, limit_shot, cavity) => {
  await runQuery(`INSERT INTO kanagata (id_kanagata, actual_shot, limit_shot, cavity) VALUES (?, ?, ?, ?)`, [id, actual_shot, limit_shot, cavity]);
  return true
};

const updateKanagataById = async (id, kanagataData) => {
    const { id_kanagata, actual_shot, limit_shot, cavity } = kanagataData;
    await dbPool.query(`UPDATE kanagata SET id_kanagata = ?, actual_shot = ?, limit_shot = ?, cavity = ? WHERE id_kanagata = ?`, [id_kanagata, actual_shot, limit_shot, cavity, id]);
    return true
}

const findKanagataById = async (id) => {
    return await runQuery('SELECT id_kanagata, actual_shot, limit_shot FROM kanagata WHERE id_kanagata = ? ', [id]);
}

const getAllKanagata = async () => {
    return await runQuery('SELECT * from kanagata where deleted_at is null')
}

const deleteKanagataById = async (id) => {
    const currentTime = new Date().toISOString();
    await runQuery('UPDATE kanagata SET deleted_at = ? WHERE id_kanagata = ?', [currentTime, id]);
    return true; // Kembalikan true jika pengguna berhasil dihapus
};

module.exports = {
  addKanagata,
  getAllKanagata,
  updateKanagataById,
  findKanagataById,
  deleteKanagataById
}