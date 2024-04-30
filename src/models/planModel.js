const dbPool = require('../config/database')

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};


const addPlan = async (id_pca, qty, shift, date_start, date_end) => {
  const time_plan = (new Date(date_end) - new Date(date_start)) / (1000 * 60);
  await runQuery('INSERT INTO plan (id_pca, qty, shift, start, end, time_plan) VALUES (?, ?, ?, ?, ?, ?)', [id_pca, qty, shift, date_start, date_end, time_plan]);
  return true;
};

const getAllPlan = async () => {
  return await runQuery(`
  SELECT plan.id_plan, plan.qty, plan.shift, plan.start, plan.end, plan.time_plan, pro.name, pca.id_kanagata, pca.id_machine
  FROM plan
  JOIN pca ON pca.id_pca = plan.id_pca
  JOIN product as pro ON pro.id_product = pca.id_product
  WHERE plan.deleted_at is null
  ORDER BY plan.start asc
  `)
}

module.exports = {
  getAllPlan,
  addPlan,
}