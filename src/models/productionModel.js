const dbPool = require('../config/database');

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const getAllProduction = async () => {
  return await runQuery('SELECT * FROM production WHERE deleted_at is null')
};

const filterProductionByDate = async (date_start, date_end) => {
  return await runQuery('SELECT * FROM production WHERE date >= ? AND date <= ? AND deleted_at is null', [date_start, date_end])
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

module.exports = {
  getAllProduction,
  filterProductionByDate,
  filterProductionByIdProduct,
  filterProductionByIdMachine
};