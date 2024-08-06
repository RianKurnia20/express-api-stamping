const maintenancePartModel = require('../models/maintenancePartModel')

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

const getAllMaintenancePartByMachine = async (req, res) => {
  const { id_machine } = req.query
  try {
    const data = await maintenancePartModel.getLogMaintenancePartByMachine(id_machine)
    const message = data.length === 0 ? 'No Data' : 'Success'
    handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

const getMaintenancePartByDateRangeAndMachine = async (req, res) => {
  const { date_start, date_end, id_machine } = req.query
  try {
    if(!date_start || !date_end || !id_machine){
      return handleResponse(res,'start date, end date, id machine are required', 400)
    }
    const data = await maintenancePartModel.logMaintenancePartByMachineAndDateRange(date_start, date_end, id_machine)
    const message = data.length === 0 ? 'No Data' : 'Success'
    handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  getAllMaintenancePartByMachine,
  getMaintenancePartByDateRangeAndMachine
}