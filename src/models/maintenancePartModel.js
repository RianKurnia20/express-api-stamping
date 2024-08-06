const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getLogMaintenancePartByMachine = async (id_machine) => {
  return await runQuery(`SELECT id_machine, part, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s' ) as created_at FROM log_maintenance_part WHERE id_machine = ?`,[id_machine])
}

const logMaintenancePartByMachineAndDateRange = async (start, end, id_machine) => {
  return await runQuery(
    `SELECT 
    id_machine, 
    part, 
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s' ) as created_at 
    FROM log_maintenance_part 
    WHERE created_at between ? AND DATE_ADD( ? , INTERVAL 1 DAY) 
    AND id_machine = ?`,
    [start, end, id_machine])
}

module.exports = {
  getLogMaintenancePartByMachine,
  logMaintenancePartByMachineAndDateRange
}