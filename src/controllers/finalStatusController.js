const finalStatusModel = require('../models/finalStatusModel');

const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {  
    res.status(status).json({ message });
  };
}

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const getAllFinalStatus = async (req, res) => {
  try {
    const data = await finalStatusModel.getAllFinalStatus()
    const message = data.length === 0 ? 'No data' : 'Success'
    handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

const getFinalStatusWithDateRange = async (req, res) => {
  const { date_start, date_end } = req.query
  try {
    if(!date_start || !date_end){
      return handleResponse(res,'Both start date and end date are required', 400)
    }
    const data = await finalStatusModel.filterFinalStatusByDateRange(req.query.date_start, req.query.date_end)
    const message = data.length === 0 ? 'No Data' : 'Success'
    handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

const getCountFinalStatusByMachine = async (req, res) => {
  const  {date_start, date_end, id_machine} = req.query
  try {
    if (!date_start || !date_end || !id_machine){
      return handleResponse(res,'All query parameters are required', 400)
    }
    const data = await finalStatusModel.countFinalStatusByMachine(req.query.date_start, req.query.date_end, req.query.id_machine)
    const message = data.length === 0 ? 'No Data' : 'Success'
    handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  getAllFinalStatus,
  getFinalStatusWithDateRange,
  getCountFinalStatusByMachine
}