const planModel = require("../models/planModel");
const pcaModel = require("../models/pcaModel")

const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {
    res.status(status).json({ message });
  }
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Server Error" });
};

const newPlan = async (req, res) => {
  const { id_pca, qty, shift, date_start, date_end } = req.body;
  try {
    if (!id_pca || !shift || !date_start || !date_end) {
      return handleResponse(res, "All fields are required", 400);
    }
    if (qty <= 0) {
      return handleResponse(res, "Quantity must be greater than 0", 400);
    }
    
    const pca = await pcaModel.getPcaByIdPca(id_pca)
    const time_plan = (qty / (pca[0].speed * pca[0].cavity)).toFixed(1)


    await planModel.addPlan(id_pca, qty, shift, date_start, date_end, time_plan);
    handleResponse(res, "Create production plan successfully");
  } catch (error) {
    handleError(res, error);
  }
};

const getAllPlan = async (req, res) => {
  const { id_plan, id_machine } = req.query;
  let data, message;
  try {
    if (!id_plan) {
      data = await planModel.getAllPlan(null, id_machine);
    } else {
      data = await planModel.getAllPlan(id_plan);
    }
    message = data.length === 0 ? "No production plan available" : "Success";
    handleResponse(res, message, 200, data);
  } catch (error) {
    handleError(res, error);
  }
};

const updatedPlan = async (req, res) => {
  try {
    const { id_pca, qty, shift, start, end } = req.body;
    if (!id_pca || !qty || !shift || !start || !end) {
      return handleResponse(res, "All fields are required", 400);
    }

    if (qty <= 0) {
      return handleResponse(res, "Quantity must be greater than 0", 400);
    }

    const pca = await pcaModel.getPcaByIdPca(id_pca)
    const time_plan = (qty / (pca[0].speed * pca[0].cavity)).toFixed(1)
    req.body.time_plan = time_plan
    console.log(req.body)

    await planModel.updatePlanById(req.params.id, req.body);
    handleResponse(res, "Update production plan successfully");
  } catch (error) {
    handleError(res, error);
  }
};

const deletePlan = async (req, res) => {
  try {
    const checkRelation = await planModel.getPlanById(req.params.id);
    if (checkRelation.length > 0) {
      return handleResponse(
        res,
        "Data cannot be deleted because it is referenced by production data",
        400
      );
    } else {
      const deleted = await planModel.deletePlanById(req.params.id);
      const message = deleted
        ? "Production plan data deleted"
        : "Production plan data not found";
      handleResponse(res, message);
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  newPlan,
  getAllPlan,
  updatedPlan,
  deletePlan,
};
