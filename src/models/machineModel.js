const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addMachine = async (id, address) => {
  await runQuery('INSERT INTO machine (id_machine, address) VALUES (?, ?)', [id, address]);
  return true;
};

const updateMachineById = async (id, machineData) => {
  const { actual_shot, limit_shot, shift, address } = machineData;
  await runQuery('UPDATE machine SET actual_shot = ?, limit_shot = ?, shift = ?, address = ? WHERE id_machine = ?', [actual_shot, limit_shot,shift, address, id]);
  return true;
};

const getAllMachine = async () => {
  return await runQuery('SELECT * FROM machine WHERE deleted_at IS NULL');
};

const deleteMachineById = async (id) => {
  const currentTime = new Date().toISOString();
  await runQuery('UPDATE machine SET deleted_at = ? WHERE id_machine = ?', [currentTime, id]);
  return true;
};

const getMachineById = async (id) => {
  return await runQuery('SELECT * FROM machine WHERE id_machine = ?', [id]);
};

module.exports = {
  addMachine,
  updateMachineById,
  getAllMachine,
  deleteMachineById,
  getMachineById
};
