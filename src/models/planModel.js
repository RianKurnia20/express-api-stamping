const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addPlan = async (id_pca, qty, shift, date_start, date_end, time_plan) => {
  // const time_plan = (new Date(date_end) - new Date(date_start)) / (1000 * 60);
  await runQuery(
    "INSERT INTO plan (id_pca, qty, shift, start, end, time_plan) VALUES (?, ?, ?, ?, ?, ?)",
    [id_pca, qty, shift, date_start, date_end, time_plan]
  );
  return true;
};

const searchPlanByIdPca = async (id_pca) => {
  return await runQuery(
    `SELECT p.id_plan, p.qty, pca.id_machine, pca.id_product, product.name, pca.id_kanagata, DATE_FORMAT(p.start,'%Y-%m-%d %H:%i:%s') AS start, DATE_FORMAT(p.end,'%Y-%m-%d %H:%i:%s') AS end, p.shift
    FROM plan p
    LEFT JOIN production prod ON p.id_plan = prod.id_plan
    JOIN pca on p.id_pca = pca.id_pca
    JOIN product on pca.id_product = product.id_product
    WHERE prod.id_plan IS NULL
    AND p.id_pca = ?
    ORDER BY p.start asc`,
    [id_pca]
  )
}

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
    if (id_machine !== "ALL") {
      query += ` AND pca.id_machine = ?`;
      params.push(id_machine);
    }
    query += ` ORDER BY plan.start ASC`;
    return await runQuery(query, params);
  } else {
    return await runQuery(`SELECT * FROM plan WHERE id_plan = ?`, [id_plan]);
  }
};

const getPlanById = async (id_plan = null) => {
  return await runQuery(
    `SELECT p.id_production FROM plan
    JOIN production as p on plan.id_plan = p.id_plan
    WHERE plan.id_plan = ?`,
    [id_plan]
  );
};

const getDetailPlan = async (id_plan) => {
  return await runQuery(
    `SELECT * FROM plan WHERE id_plan = ?`, [id_plan]
  )
}

const updatePlanById = async (id_plan, planData) => {
  const { id_pca, qty, shift, start, end, time_plan } = planData;
  // const time_plan = (new Date(end) - new Date(start)) / (1000 * 60);
  await runQuery(
    "UPDATE plan SET id_pca = ?, qty = ?, shift = ?, start = ?, end = ?, time_plan = ? WHERE id_plan = ?",
    [id_pca, qty, shift, start, end, time_plan, id_plan]
  );
  return true;
};

const validationPlanByDate = async (date_start, date_end, shift, id_pca) => {

  const startDate = `${date_start.split(' ')[0]}%`;
  const endDate = `${date_end.split(' ')[0]}%`;
  
  return await runQuery(`
  SELECT plan.id_plan, pca.id_machine, pca.id_product, pca.id_kanagata, plan.qty, plan.shift, plan.start, plan.end
  FROM plan
  JOIN pca ON plan.id_pca = pca.id_pca
  WHERE plan.start like ?
  AND plan.shift = ?
  AND plan.id_pca = ?
  AND plan.end like ?
  `, [startDate, shift, id_pca, endDate]);
};

const deletePlanById = async (id_plan) => {
  // const currentTime = new Date().toISOString();
  await runQuery("DELETE FROM plan WHERE id_plan = ?", [id_plan]);
  return true;
};

module.exports = {
  getPlanById,
  getAllPlan,
  addPlan,
  updatePlanById,
  deletePlanById,
  validationPlanByDate,
  searchPlanByIdPca,
  getDetailPlan
};
