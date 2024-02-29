const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addProblem = async (id, name) => {
  await runQuery(`INSERT INTO problem (id_problem, name) VALUES (?, ?)`, [id, name]);
  return true;
};

const getAllProblem = async () => {
  return await runQuery(`SELECT * FROM problem where deleted_at is null`)
}

const findProblemById = async (id) => {
  return await runQuery('SELECT id_problem,name FROM problem WHERE id_problem = ?', [id]);
}

const updateProblemById = async (id, problemData) => {
  const { id_problem, name } = problemData;
  await runQuery(`UPDATE problem SET id_problem = ?, name = ? WHERE id_problem = ?`, [id_problem, name, id]);
  return true
}

const deleteProblemById = async (id) => {
    const currentTime = new Date().toISOString();
    await runQuery('UPDATE problem SET deleted_at = ? WHERE id_problem = ?', [currentTime, id]);
    return true;
}

module.exports = {
  addProblem,
  getAllProblem,
  findProblemById,
  updateProblemById,
  deleteProblemById
}