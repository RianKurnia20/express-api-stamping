const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

// Get all data production
const getAllProduction = async () => {
  return await runQuery(
    `SELECT p.id_production, p.date, p.shift, p.ok, p.ng, p.reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time, pca.id_machine, pca.id_product, pca.id_kanagata, product.name  
    FROM production as p
    JOIN pca ON p.id_pca = pca.id_pca
    JOIN product ON pca.id_product = product.id_product
    WHERE p.deleted_at is null`
    )
};

// Get data production with filter date range and machine
const filterProductionByDate = async (id_machine, date_start, date_end) => {
  return await runQuery(
  `SELECT pca.id_machine, pca.id_product, product.name , DATE_FORMAT(p.date,'%Y-%m-%d %H:%i:%s') AS date, p.shift, p.ok, p.ng, p.reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time
  FROM production as p
  INNER JOIN pca ON p.id_pca=pca.id_pca
  INNER JOIN product ON pca.id_product = product.id_product
  WHERE pca.id_machine = ? AND p.date BETWEEN ? AND DATE_ADD( ? , INTERVAL 1 DAY) AND p.deleted_at is null
  ORDER BY p.date ASC`, [id_machine, date_start, date_end])
};

// Get total and ppm production data ok, ng, reject_setting, dummy, stop_time with filter date range and machine
const ppmProductionByDate = async (id_machine, date_start, date_end) => {
  return await runQuery(
    `SELECT sum(p.ok) as total_ok, sum(p.ng) as total_rip, sum(p.reject_setting) as total_rs, sum(p.dummy) as total_dummy, sum(p.stop_time) as total_stoptime, ROUND(sum(p.ng)/(sum(p.ok) + sum(p.ng)) * 1000000) as rip_ppm, ROUND(sum(p.reject_setting)/(sum(p.ok) + sum(p.ng)) * 1000000) as rs_ppm, ROUND(sum(p.dummy)/(sum(p.ok) + sum(p.ng)) * 1000000) as dummy_ppm
    FROM production as p
    INNER JOIN pca ON p.id_pca=pca.id_pca
    INNER JOIN product ON pca.id_product = product.id_product
    WHERE pca.id_machine = ? AND p.date BETWEEN ? AND DATE_ADD( ? , INTERVAL 1 DAY) AND p.deleted_at is null
    ORDER BY p.date ASC`, [id_machine, date_start, date_end])
};

// Get total production data with filter year-month and machine
const productionByMachineMonth = async (id_machine, year, month) => { 
  return await runQuery(
    `SELECT YEAR(p.date) as year, MONTH(p.date) as month, product.name , SUM(p.ok) as ok, SUM(p.ng) as rip, SUM(p.reject_setting) as reject_setting, SUM(p.dummy) as dummy, SUM(p.stop_time) as stop_time
    FROM production as p
    INNER JOIN pca ON p.id_pca=pca.id_pca
    INNER JOIN product ON pca.id_product = product.id_product
    WHERE pca.id_machine = ?
    AND YEAR(p.date) = ? 
    AND MONTH(p.date) = ?
    AND p.deleted_at IS NULL
    GROUP BY product.name
    ORDER BY product.name ASC`, [id_machine, year, month])
}

// Get total production data all machine with filter year-month grouping  by machine
const totalProductionByMonth = async (id_machine ,year, month) => { 
  return await runQuery(
    `SELECT YEAR(p.date) as year, MONTH(p.date) as month, pca.id_machine, SUM(p.ok) as ok, SUM(p.ng) as rip, SUM(p.reject_setting) as reject_setting, SUM(p.dummy) as dummy, SUM(p.stop_time) as stop_time 
    FROM production as p 
    INNER JOIN pca ON p.id_pca=pca.id_pca 
    INNER JOIN product ON pca.id_product = product.id_product 
    WHERE pca.id_machine = ?
    AND YEAR(p.date) = ? AND MONTH(p.date) = ? AND p.deleted_at IS NULL
    GROUP BY pca.id_machine 
    ORDER BY pca.id_machine ASC;`, [id_machine, year, month])
}

const filterProductionByIdProduct = async (id_product) => {
  return await runQuery(
    `SELECT a.date, a.ok, a.ng, a.reject_setting, a.stop_time, a.production_time, a.shift, b.id_machine, b.id_product
    FROM production as a
    JOIN pca as b
    ON a.id_pca = b.id_pca
    WHERE b.id_product = ? AND a.deleted_at is null`,
    [id_product]
  )
}

const filterProductionByIdMachine = async (id_machine) => {
  return await runQuery(
    `SELECT a.date, a.ok, a.ng, a.reject_setting, a.stop_time, a.production_time, a.shift, b.id_machine, b.id_product
    FROM production as a
    JOIN pca as b
    ON a.id_pca = b.id_pca
    WHERE b.id_machine = ? AND a.deleted_at is null`,
    [id_machine]
  )
}

const updateProductionById = async (id, machineData) => {
  const { reject_setting, ng, dummy } = machineData;
  await runQuery('UPDATE production SET reject_setting = ?, ng = ?, dummy = ? WHERE id_production = ?', [reject_setting, ng, dummy, id]);
  return true;
};

const filterProductionFiscalByYearMonth= async (year) => {
  return await runQuery(
    `SELECT year(date) as year, month(date) as month, sum(ok) as ok, sum(ng) as ng, sum(reject_setting) as reject_setting, sum(dummy) as dummy, sum(production_time) as production_time, sum(dandori_time) as dandori_time, sum(stop_time) as stop_time 
    FROM production 
    WHERE year(date) = ? 
    AND month(date) >= 4 
    OR year(date) = ? + 1 
    AND month(date) < 4 
    AND deleted_at is null 
    GROUP BY YEAR(date), MONTH(date);`, [year, year])
}

module.exports = {
  getAllProduction,
  filterProductionByDate,
  filterProductionByIdProduct,
  filterProductionByIdMachine,
  updateProductionById,
  ppmProductionByDate,
  productionByMachineMonth,
  totalProductionByMonth,
  filterProductionFiscalByYearMonth
};