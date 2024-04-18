const productionModel = require('../models/productionModel');
const dateHandle = require('../middleware/dateHandle')

// fungsi untuk handle response permintaan
const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {  
    res.status(status).json({ message });
  };
}
// fungsi untuk handle error permintaan
const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

// fungsi untuk format struktur data production
const processProduction = (dateRange, queryResult) => {
    const initializeShiftData = () => ({
        ok: Array(dateRange.length).fill(0),
        ng: Array(dateRange.length).fill(0),
        reject_setting: Array(dateRange.length).fill(0),
        dummy: Array(dateRange.length).fill(0),
        production_time: Array(dateRange.length).fill(0),
        stop_time: Array(dateRange.length).fill(0),
        dandori_time: Array(dateRange.length).fill(0)
    });

    const updateShiftData = (shiftData, result, index) => {
        shiftData.ok[index] += result.ok;
        shiftData.ng[index] += result.ng;
        shiftData.reject_setting[index] += result.reject_setting;
        shiftData.dummy[index] += result.dummy;
        shiftData.production_time[index] += result.production_time;
        shiftData.stop_time[index] += result.stop_time;
        shiftData.dandori_time[index] += result.dandori_time;
    };

    const data = {
        date_range: dateRange,
        shift1: initializeShiftData(),
        shift2: initializeShiftData()
    };

    queryResult.forEach(result => {
        const date = result.date.slice(0, 10);
        const shift = result.shift;
        const index = dateRange.indexOf(date);
        if (index !== -1) {
            updateShiftData(data[`shift${shift}`], result, index);
        }
    });

    return data;
};

const getAllProduction = (req, res) => {
  productionModel.getAllProduction()
    .then(production => {
      const data = production.length === 0 ? 'No production data available' : production;
      handleResponse(res, 'Success', 200, data);
    })
    .catch(error => {
      handleError(res, error);
    });
};


const getProductionByDate = async (req, res) => {
  const { id_machine, date_start, date_end } = req.query;
  try {
    const data = await productionModel.filterProductionByDate(id_machine, date_start, date_end)
    const message = data.length === 0 ? 'No data production' : 'Success'
    // Generate Array Date Range sesuai inputan request dari front end untuk ploting ke front end
    const dateRange = dateHandle.generateDateRange(date_start, date_end)
    const formattedData = processProduction(dateRange, data)

    return handleResponse(res, message, 200, formattedData)
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
    const message = data.length === 0 ? 'No data production' : 'Success'
    return handleResponse(res, message, 200, data)
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
    const message = data.length === 0 ? 'No data production' : 'Success'
    return handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

const updateProduction = async (req, res) => {
  try {
    const { reject_setting, ng } = req.body;
    if( reject_setting === '' || ng === '' ) {
      return handleResponse(res, 'All fields are required', 400)
    }
    await productionModel.updateProductionById(req.params.id, req.body)
    return handleResponse(res, 'Update production data successfully');
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getAllProduction,
  getProductionByDate,
  getProductionByIdProduct,
  getProductionByIdMachine,
  updateProduction
};
