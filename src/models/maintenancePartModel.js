const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getLogMaintenancePartByMachine = async (id_machine) => {
  return await runQuery(
  `
  SELECT t1.id_machine, t1.part, DATE_FORMAT(t1.created_at, '%Y-%m-%d %H:%i:%s') as created_at
  FROM log_maintenance_part t1
  INNER JOIN (
    SELECT part, MAX(created_at) AS latest_created_at
    FROM log_maintenance_part
    WHERE id_machine = ?
    GROUP BY part
  ) t2
  ON t1.part = t2.part AND t1.created_at = t2.latest_created_at
  WHERE t1.id_machine = ?`,
    [id_machine, id_machine]
  );
};

const logMaintenancePartByMachineAndDateRange = async (
  start,
  end,
  id_machine
) => {
  return await runQuery(
    `SELECT 
    id_machine, 
    part, 
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s' ) as created_at 
    FROM log_maintenance_part 
    WHERE created_at between ? AND DATE_ADD( ? , INTERVAL 1 DAY) 
    AND id_machine = ?`,
    [start, end, id_machine]
  );
};

module.exports = {
  getLogMaintenancePartByMachine,
  logMaintenancePartByMachineAndDateRange,
};
