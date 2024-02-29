const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getAllStatus = async () => {
  return await runQuery('SELECT * from status')
}

module.exports = {
  getAllStatus
}