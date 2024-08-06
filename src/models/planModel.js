const dbPool = require('../config/database')

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};


const addPlan = async (id_pca, qty, shift, date_start, date_end, time_plan) => {
  // const time_plan = (new Date(date_end) - new Date(date_start)) / (1000 * 60);
  await runQuery('INSERT INTO plan (id_pca, qty, shift, start, end, time_plan) VALUES (?, ?, ?, ?, ?, ?)', [id_pca, qty, shift, date_start, date_end, time_plan]);
  return true;
};

const getAllPlan = async (id_plan = null, id_machine = null) => {
  if (!id_plan) {
    let query = `
      SELECT plan.id_plan, plan.qty, plan.shift, plan.start, plan.end, plan.time_plan, pro.name, pca.id_kanagata, pca.id_machine
      FROM plan
      JOIN pca ON pca.id_pca = plan.id_pca
      JOIN product as pro ON pro.id_product = pca.id_product
      WHERE 1=1
      AND plan.deleted_at is null
    `;
    let params = [];
    // Jika id_machine bukan 'ALL', tambahkan klausa WHERE
    if (id_machine !== 'ALL') {
      query += ` AND pca.id_machine = ?`;
      params.push(id_machine);
    }
    query += ` ORDER BY plan.start ASC`;
    return await runQuery(query, params);
  } else {
    return await runQuery(`SELECT * FROM plan WHERE id_plan = ?`, [id_plan]);
  }
}

const getPlanById = async (id_plan = null) => {
  return await runQuery(
    `SELECT p.id_production FROM plan
    JOIN production as p on plan.id_plan = p.id_plan
    WHERE plan.id_plan = ?`
    , [id_plan]
    );
}


const updatePlanById = async (id_plan, planData) => {
  const { id_pca, qty, shift, start, end, time_plan } = planData
  // const time_plan = (new Date(end) - new Date(start)) / (1000 * 60);
  await runQuery(
    'UPDATE plan SET id_pca = ?, qty = ?, shift = ?, start = ?, end = ?, time_plan = ? WHERE id_plan = ?',
    [id_pca, qty, shift, start, end, time_plan, id_plan]
    )
  return true
}

const deletePlanById = async(id_plan) => {
  // const currentTime = new Date().toISOString();
  await runQuery('DELETE FROM plan WHERE id_plan = ?', [id_plan]);
  return true;
}

module.exports = {
  getPlanById,
  getAllPlan,
  addPlan,
  updatePlanById,
  deletePlanById
}