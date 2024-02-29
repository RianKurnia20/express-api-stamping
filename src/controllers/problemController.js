const problemModel = require('../models/problemModel.js')

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ message });
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const newProblem = async (req, res) => {
  const { id_problem, name } = req.body;
  try {

    if(!id_problem || !name){
      return handleResponse(res, 'All fields are required', 400);
    }

    const existingData = await problemModel.findProblemById(id_problem)
    if(existingData[0]){
      return handleResponse(res, 'Problem ID already exists', 400)
    }

    await problemModel.addProblem(id_problem, name)
    handleResponse(res, 'Create new problem data successfully')
  } catch (error) {
    handleError(res, error);
  }
}

const getAllProblem = async (req, res) => {
  try {
    const data = await problemModel.getAllProblem()
    const message = data.length === 0 ? 'No problem data available, Add some data' : data
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

const updateProblem = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_problem, name } = req.body;

    if (!id_problem || !name) {
      return handleResponse(res, 'All fields are required');
    }

    const checkOldProblem = await problemModel.findProblemById(id);
    if (!checkOldProblem[0]) {
      return handleResponse(res, 'Problem with id : ' + id + ' not found');
    }

    await problemModel.updateProblemById(id, req.body )
    handleResponse(res, 'Update Problem Data Successfully')
  } catch (error) {
    handleError(res, error)
  }
}

const deleteProblem = async(req, res) => {
  try {
    const deleted = await problemModel.deleteProblemById(req.params.id);
    const message = deleted ? 'Problem deleted successfully' : 'Problem data not found'
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newProblem,
  getAllProblem,
  updateProblem,
  deleteProblem
}