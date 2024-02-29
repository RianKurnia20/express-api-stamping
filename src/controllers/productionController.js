const productionModel = require('../models/productionModel');

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ message });
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const getAllProduction = async (req, res) => {
  try {
    const production = await productionModel.getAllProduction()
    const message = production.length === 0 ? 'No production data available' :production
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
};

const getProductionByDate = async (req, res) => {
  const { date_start, date_end } = req.query;
  try {
    const data = await productionModel.filterProductionByDate(date_start, date_end)
    const message = data.length === 0 ? 'No data production' : data
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
};

const getProductionByIdProduct = async (req, res) => {
  const { id_product } = req.query;
  try {
    if (!id_product) {
      return handleResponse(res, 'Query params required', )
    }
    const data = await productionModel.filterProductionByIdProduct(id_product)
    const message = data.length === 0 ? 'No data production' : data
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

const getProductionByIdMachine = async (req, res) => {
  const { id_machine } = req.query;
  try {
    if (!id_machine) {
      return handleResponse(res, 'ID machine required')
    }
    const data = await productionModel.filterProductionByIdMachine(id_machine)
    const message = data.length === 0 ? 'No data production' : data
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  getAllProduction,
  getProductionByDate,
  getProductionByIdProduct,
  getProductionByIdMachine
};
