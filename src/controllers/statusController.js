const statusModel  = require('../models/statusModel.js');

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

const getAllStatus = async(req, res) => {
  try {
    const data = await statusModel.getAllStatus();
    const message = data.length === 0 ? 'No status available' : 'Success';
    handleResponse(res, message, 200, data)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  getAllStatus
}