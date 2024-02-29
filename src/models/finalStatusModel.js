const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getAllFinalStatus = async () => {
  return await runQuery(
    `SELECT id_final_status, id_status, id_problem, id_machine, DATE_FORMAT(start, '%Y-%m-%d %H:%i:%s') as start, DATE_FORMAT(end, '%Y-%m-%d %H:%i:%s') as end FROM final_status`
    )
};

const filterFinalStatusByDateRange = async (date_start, date_end) => {
  return await runQuery(
    `SELECT id_final_status, id_status, id_problem, id_machine, DATE_FORMAT(start, '%Y-%m-%d %H:%i:%s') as start, DATE_FORMAT(end, '%Y-%m-%d %H:%i:%s') as end FROM final_status where start between ? and ?`,
    [date_start, date_end]
  )
;
}

const countFinalStatusByMachine = async (date_start, date_end, machine) => {
  return await runQuery(
    `SELECT COUNT(final_status.id_problem) AS count, problem.name, SUM(final_status.duration) AS duration
    FROM final_status
    JOIN problem on final_status.id_problem = problem.id_problem
    WHERE start BETWEEN ? AND ?  AND id_machine = ? GROUP BY final_status.id_problem`,
    [date_start, date_end, machine]
  )
}

module.exports = {
  getAllFinalStatus,
  filterFinalStatusByDateRange,
  countFinalStatusByMachine
}