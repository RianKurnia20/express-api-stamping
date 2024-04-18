const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getAllProduction = async () => {
  return await runQuery(
    `SELECT p.id_production, p.date, p.shift, p.ok, p.ng, p.reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time, pca.id_machine, pca.id_product, pca.id_kanagata, product.name  
    FROM production as p
    JOIN pca ON p.id_pca = pca.id_pca
    JOIN product ON pca.id_product = product.id_product
    WHERE p.deleted_at is null`
    )
};

const filterProductionByDate = async (id_machine, date_start, date_end) => {
  return await runQuery(
  `SELECT pca.id_machine, pca.id_product, product.name , DATE_FORMAT(p.date,'%Y-%m-%d %H:%i:%s') AS date, p.shift, p.ok, p.ng, p.reject_setting, p.dummy, p.production_time, p.stop_time, p.dandori_time
  FROM production as p
  INNER JOIN pca ON p.id_pca=pca.id_pca
  INNER JOIN product ON pca.id_product = product.id_product
  WHERE pca.id_machine = ? AND p.date BETWEEN ? AND DATE_ADD( ? , INTERVAL 1 DAY) AND p.deleted_at is null
  ORDER BY p.date ASC`, [id_machine, date_start, date_end])
  // return await runQuery('SELECT * FROM production WHERE date >= ? AND date <= ? AND deleted_at is null', [date_start, date_end])
};

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

module.exports = {
  getAllProduction,
  filterProductionByDate,
  filterProductionByIdProduct,
  filterProductionByIdMachine,
  updateProductionById
};