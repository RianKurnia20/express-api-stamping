const statusModel  = require('../models/statusModel.js');

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ message });
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const getAllStatus = async(req, res) => {
  try {
    const stats = await statusModel.getAllStatus();
    const message = stats.length === 0 ? 'No status available' : stats;
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  getAllStatus
}