const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

// Get all data production
const getAllProduction = async () => {
  return await runQuery(
    `SELECT p.id_production, p.date, p.shift, (p.ok - p.ng) as ok, p.ng, p.reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time, pca.id_machine, pca.id_product, pca.id_kanagata, product.name,  TRUNCATE((p.ok - p.ng) as ok / ((p.production_time + p.dandori_time + p.stop_time) * kanagata.cavity * pca.speed) * 100, 2) as kadoritsu
    FROM production as p
    JOIN pca ON p.id_pca = pca.id_pca
    JOIN product ON pca.id_product = product.id_product
    JOIN kanagata ON pca.id_kanagata = kanagata.id_kanagata
    WHERE p.deleted_at is null`
  );
};

// Get all data production
const getAllProductionFilterMachineMonth = async (id_machine, year, month) => {
  return await runQuery(
    `SELECT p.id_production, p.date, p.shift, (p.ok - p.ng) as ok, p.ng, (p.reject_setting - p.dummy) as reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time, pca.id_machine, pca.id_product, pca.id_kanagata, product.name, TRUNCATE((p.ok - p.ng) / ((p.production_time + p.dandori_time + p.stop_time) * kanagata.cavity * pca.speed) * 100, 2) as kadoritsu, plan.qty as qty_plan, TRUNCATE(((p.ok - p.ng) / plan.qty)*100,1) as bekidoritsu
    FROM production as p
    JOIN pca ON p.id_pca = pca.id_pca
    JOIN product ON pca.id_product = product.id_product
    JOIN kanagata ON pca.id_kanagata = kanagata.id_kanagata
    LEFT JOIN plan on p.id_plan = plan.id_plan
    WHERE pca.id_machine = ?
    AND YEAR(p.date) = ? 
    AND MONTH(p.date) = ?
    AND p.deleted_at is null
    `,
    [id_machine, year, month]
  );
};

// Get data production with filter date range and machine
const filterProductionByDate = async (id_machine, date_start, date_end) => {
  return await runQuery(
    `SELECT pca.id_machine, pca.id_product, product.name , DATE_FORMAT(p.date,'%Y-%m-%d %H:%i:%s') AS date, p.shift, (p.ok - p.ng) as ok, p.ng, (p.reject_setting - p.dummy) as reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time, TRUNCATE((p.ok - p.ng) / ((p.production_time + p.dandori_time + p.stop_time) * kanagata.cavity * pca.speed) * 100, 1) as kadoritsu, TRUNCATE(((p.ok - p.ng) / plan.qty)*100,1) as bekidoritsu
  FROM production as p
  INNER JOIN pca ON p.id_pca=pca.id_pca
  INNER JOIN product ON pca.id_product = product.id_product
  INNER JOIN kanagata on pca.id_kanagata = kanagata.id_kanagata
  LEFT JOIN plan on p.id_plan = plan.id_plan
  WHERE pca.id_machine = ? AND p.date BETWEEN ? AND DATE_ADD( ? , INTERVAL 1 DAY) AND p.deleted_at is null
  ORDER BY p.date ASC`,
    [id_machine, date_start, date_end]
  );
};

// Get total and ppm production data ok, ng, reject_setting, dummy, stop_time with filter date range and machine
const ppmProductionByDate = async (id_machine, date_start, date_end) => {
  return await runQuery(
    `SELECT sum(p.ok-p.ng) as total_ok, sum(p.ng) as total_rip, sum(p.reject_setting - p.dummy) as total_rs, sum(p.dummy) as total_dummy, sum(p.stop_time) as total_stoptime, 
    ROUND(sum(p.ng)/(sum(p.ok) + sum(p.ng)) * 1000000) as rip_ppm, 
    ROUND(sum(p.reject_setting)/(sum(p.ok) + sum(p.ng)) * 1000000) as rs_ppm, 
    ROUND(sum(p.dummy)/(sum(p.ok) + sum(p.ng)) * 1000000) as dummy_ppm
    FROM production as p
    INNER JOIN pca ON p.id_pca=pca.id_pca
    INNER JOIN product ON pca.id_product = product.id_product
    WHERE pca.id_machine = ? AND p.date BETWEEN ? AND DATE_ADD( ? , INTERVAL 1 DAY) AND p.deleted_at is null
    ORDER BY p.date ASC`,
    [id_machine, date_start, date_end]
  );
};

// Get total production data with filter year-month and machine
const productionByMachineMonth = async (id_machine, year, month) => {
  return await runQuery(
    `SELECT YEAR(p.date) as year, MONTH(p.date) as month, product.name , SUM(p.ok-p.ng) as ok, SUM(p.ng) as rip, SUM(p.reject_setting - p.dummy) as reject_setting, SUM(p.dummy) as dummy, SUM(p.stop_time) as stop_time, TRUNCATE(sum((p.ok-p.ng) * product.price),2) as sales, sum(p.production_time) as production_time, sum(p.dandori_time) as dandori_time, TRUNCATE(SUM(p.production_time) / (SUM(p.stop_time) + SUM(p.dandori_time) + SUM(p.production_time)) * 100, 1) AS kadoritsu
    FROM production as p
    INNER JOIN pca ON p.id_pca=pca.id_pca
    INNER JOIN product ON pca.id_product = product.id_product
    WHERE pca.id_machine = ?
    AND YEAR(p.date) = ? 
    AND MONTH(p.date) = ?
    AND p.deleted_at IS NULL
    GROUP BY product.name
    ORDER BY product.name ASC`,
    [id_machine, year, month]
  );
};

// Get total production data all machine with filter year-month grouping  by machine
const totalProductionByMonth = async (id_machine, year, month) => {
  return await runQuery(
    `SELECT YEAR(p.date) as year, MONTH(p.date) as month, pca.id_machine, SUM(p.ok-p.ng) as ok, SUM(p.ng) as rip, SUM(p.reject_setting - p.dummy) as reject_setting, SUM(p.dummy) as dummy, SUM(p.stop_time) as stop_time, TRUNCATE(sum((p.ok-p.ng) * product.price),2) as sales, sum(p.production_time) as production_time, sum(p.dandori_time) as dandori_time
    FROM production as p
    INNER JOIN pca ON p.id_pca=pca.id_pca 
    INNER JOIN product ON pca.id_product = product.id_product 
    WHERE pca.id_machine = ?
    AND YEAR(p.date) = ? AND MONTH(p.date) = ? AND p.deleted_at IS NULL
    GROUP BY pca.id_machine 
    ORDER BY pca.id_machine ASC;`,
    [id_machine, year, month]
  );
};

const filterProductionByIdProduct = async (id_product) => {
  return await runQuery(
    `SELECT p.date, (p.ok - p.ng) as ok, p.ng, (p.reject_setting - p.dummy) as reject_setting, p.dummy, p.stop_time, p.production_time, p.shift, pca.id_machine, pca.id_product
    FROM production as p
    INNER JOIN pca 
    ON p.id_pca = pca.id_pca
    WHERE pca.id_product = ? AND p.deleted_at is null`,
    [id_product]
  );
};

const filterProductionByIdMachineYesterday = async (id_machine, shift) => {
  return await runQuery(
    `SELECT (a.ok - a.ng) as ok, a.ng, (a.reject_setting - a.dummy) as reject_setting, a.stop_time, b.id_product, a.dummy, c.name as product_name, a.dandori_time
    FROM production as a
    JOIN pca as b
    ON a.id_pca = b.id_pca
    JOIN product as c
    ON b.id_product = c.id_product
    WHERE b.id_machine = ? 
    AND a.deleted_at is null
    AND DATE(a.date) = CURDATE() - INTERVAL 1 DAY
    AND a.shift = ?`,
    [id_machine, shift]
  );
};

const summaryMonthlyOee = async (id_machine, year, month) => {
  return await runQuery(
    `SELECT
    TRUNCATE(SUM(p.production_time) / SUM(plan.time_plan) * 100, 1) as availability, 
    TRUNCATE(SUM(p.ok) / SUM(plan.qty) * 100, 1) as productivity, 
    TRUNCATE(SUM(p.ok-p.ng) / SUM(p.ok) * 100, 1) as quality, 
    TRUNCATE(
        (TRUNCATE(SUM(p.production_time) / SUM(plan.time_plan) * 100, 1) *
        TRUNCATE(SUM(p.ok) / SUM(plan.qty) * 100, 1) *
        TRUNCATE(SUM(p.ok - p.ng) / SUM(p.ok) * 100, 1)) / 10000, 1
    ) as oee
    FROM production as p  
    JOIN pca on p.id_pca = pca.id_pca
    LEFT JOIN plan on p.id_plan = plan.id_plan

    WHERE pca.id_machine = ?
    AND YEAR(p.date) = ? 
    AND MONTH(p.date) = ?
    AND p.deleted_at is null;
    `,
    [id_machine, year, month]
  );
};

const dailyOee = async (id_machine, year, month) => {
  return await runQuery(
    `
    SELECT pca.id_machine, DATE_FORMAT(p.date,'%Y-%m-%d') AS date, p.shift, 
    TRUNCATE(SUM(p.production_time) / SUM(plan.time_plan) * 100, 1) as availability, 
    TRUNCATE(SUM(p.ok) / SUM(plan.qty) *100, 1) as productivity, 
    TRUNCATE(SUM(p.ok-p.ng) / SUM(p.ok) *100, 1) as quality, 
    TRUNCATE( 
      TRUNCATE(SUM(p.production_time) / SUM(plan.time_plan) * 100, 1) * 
      TRUNCATE(SUM(p.ok) / SUM(plan.qty) *100, 1) * 
      TRUNCATE(SUM(p.ok-p.ng) / SUM(p.ok) * 100, 1) / 10000, 1 ) as oee 
      FROM production as p 
      JOIN pca on p.id_pca = pca.id_pca 
      LEFT JOIN plan on p.id_plan = plan.id_plan 
      WHERE pca.id_machine = ? 
      AND YEAR(p.date) = ? 
      AND MONTH(p.date) = ?
      AND p.deleted_at is null
      GROUP BY DATE_FORMAT(p.date,'%Y-%m-%d') 
    `,
    [id_machine, year, month]
  );
};

// const updateProductionById = async (id, machineData) => {
//   const { reject_setting, ng, dummy } = machineData;
//   await runQuery(
//     "UPDATE production SET reject_setting = ?, ng = ?, dummy = ? WHERE id_production = ?",
//     [reject_setting, ng, dummy, id]
//   );
//   return true;
// };

const updateProductionById = async (id, machineData) => {
  const { ng, dummy } = machineData;
  await runQuery(
    "UPDATE production SET ng = ?, dummy = ? WHERE id_production = ?",
    [ng, dummy, id]
  );
  return true;
};

const filterProductionFiscalByYearMonth = async (year, id_machine) => {
  // Base query
  let query = `
    SELECT 
      YEAR(p.date) AS year, 
      MONTH(p.date) AS month, 
      SUM(p.ok - p.ng) AS ok, 
      SUM(p.ng) AS ng, 
      SUM(p.reject_setting - p.dummy) AS reject_setting, 
      SUM(p.dummy) AS dummy, 
      SUM(p.production_time) AS production_time, 
      SUM(p.dandori_time) AS dandori_time, 
      SUM(p.stop_time) AS stop_time,
      TRUNCATE(SUM(p.production_time) / (SUM(p.stop_time) + SUM(p.dandori_time) + SUM(p.production_time)) * 100, 1) AS kadoritsu
    FROM 
      production AS p
    JOIN
      pca ON p.id_pca = pca.id_pca
    WHERE 
      (
        (YEAR(p.date) = ? AND MONTH(p.date) >= 4)
        OR 
        (YEAR(p.date) = ? + 1 AND MONTH(p.date) < 4)
      ) 
      AND 
      p.deleted_at IS NULL 
  `;

  // Parameters for the query
  let queryParams = [year, year];

  // Append the id_machine filter if provided
  if (id_machine) {
    query += ` AND pca.id_machine = ?`;
    queryParams.push(id_machine);
  }

  // Complete the query
  query += `
    GROUP BY
      YEAR(p.date), 
      MONTH(p.date)
  `;

  // Run the query with the constructed query string and parameters
  return await runQuery(query, queryParams);
};

const summarySalesAndRejectCost = async (year) => {
  return await runQuery(
    `SELECT 
      YEAR(p.date) AS year, 
      MONTH(p.date) AS month, 
      product.name as product_name,
      TRUNCATE(SUM(p.ok-p.ng) * product.price, 2) as sales,
      TRUNCATE((SUM(p.reject_setting-p.dummy) + SUM(p.ng) + SUM(p.dummy)) * product.price, 2) as reject_cost
    FROM 
      production AS p
    JOIN
      pca ON p.id_pca = pca.id_pca
      JOIN
      product ON pca.id_product = product.id_product
    WHERE 
      (
        (YEAR(p.date) = ? AND MONTH(p.date) >= 4)
        OR 
        (YEAR(p.date) = ? + 1 AND MONTH(p.date) < 4)
      ) 
      AND 
      p.deleted_at IS NULL 
	GROUP BY
      YEAR(p.date), 
      MONTH(p.date),
      product.id_product;`,
    [year, year]
  );
};

module.exports = {
  getAllProduction,
  filterProductionByDate,
  filterProductionByIdProduct,
  filterProductionByIdMachineYesterday,
  updateProductionById,
  ppmProductionByDate,
  productionByMachineMonth,
  totalProductionByMonth,
  filterProductionFiscalByYearMonth,
  getAllProductionFilterMachineMonth,
  summarySalesAndRejectCost,
  summaryMonthlyOee,
  dailyOee
};
