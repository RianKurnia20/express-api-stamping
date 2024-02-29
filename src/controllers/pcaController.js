const pcaModel = require('../models/pcaModel');

const handleResponse = (res, message, status = 200) => {
  res.status(status).json( {message} );
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const newPca = async (req, res) => {
  const { id_machine, id_product, id_kanagata, speed } = req.body;
  try {
    if (!id_machine || !id_product || !id_kanagata || !speed) {
      return handleResponse(res, 'All fields are required', 400)
    }
    await pcaModel.addPca(id_machine, id_product, id_kanagata, speed);
    handleResponse(res, 'Create pca data successfully');
  } catch (error) {
    handleError(res, error);
  }
};

const getAllPca = async (req, res) => {
  try {
    const pca = await pcaModel.getAllPca();
    const message = pca.length === 0 ? 'No pca data available, Add some pca data' : pca;
    handleResponse(res, message);
  } catch (error) {
    handleError(res, error);
  }
};

const updatePca = async (req, res) => {
  try {
    const { id_machine, id_product, id_kanagata, speed } = req.body;
    if(!id_machine || !id_product || !id_kanagata || !speed) {
      return handleResponse(res, 'All fields are required', 400)
    }
    await pcaModel.updatePcaById(req.params.id, req.body);
    handleResponse(res, 'Update pca data successfully');
  } catch (error) {
    handleError(res, error);
  }
};

const deletePca = async (req, res) => {
  try {
    const deleted = await pcaModel.deletePcaById(req.params.id);
    const message = deleted ? 'PCA data deleted successfully' : 'PCA data not found';
    handleResponse(res, message);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getAllPca,
  updatePca,
  deletePca,
  newPca
}