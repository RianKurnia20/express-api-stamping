const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getAllFinalStatus = async () => {
  return await runQuery(
  `SELECT 
    fs.id_final_status, 
    s.name AS status, 
    p.name AS stop_condition, 
    fs.id_machine, 
    ROUND(fs.duration / 60, 1) AS duration, 
    DATE_FORMAT(fs.start, '%Y-%m-%d %H:%i:%s') AS start, 
    DATE_FORMAT(fs.end, '%Y-%m-%d %H:%i:%s') AS end 
  FROM 
      final_status AS fs
  JOIN 
      status AS s ON fs.id_status = s.id_status
  JOIN 
      problem AS p ON fs.id_problem = p.id_problem;`
  ) 
};

const FinalStatusByDateRangeAndMachine = async (date_start, date_end, machine) => {
  return await runQuery(
  `SELECT 
    fs.id_final_status, 
    s.name AS status, 
    p.name AS stop_condition, 
    fs.id_machine, 
    ROUND(fs.duration / 60, 1) AS duration, 
    DATE_FORMAT(fs.start, '%Y-%m-%d %H:%i:%s') AS start, 
    DATE_FORMAT(fs.end, '%Y-%m-%d %H:%i:%s') AS end 
  FROM 
      final_status AS fs
  JOIN 
      status AS s ON fs.id_status = s.id_status
  JOIN 
      problem AS p ON fs.id_problem = p.id_problem
  WHERE
    DATE(fs.start) between ? AND ?
  AND 
    fs.id_machine = ?
  ORDER BY fs.start desc`,
    [date_start, date_end, machine]
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
  FinalStatusByDateRangeAndMachine,
  countFinalStatusByMachine
}