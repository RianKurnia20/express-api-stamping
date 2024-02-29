const kanagataModel = require('../models/kanagataModel.js');

const handleResponse = (res, message, status = 200) => {
  res.status(status).json({ message });
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const newKanagata = async (req, res) => {
  const { id_kanagata, actual_shot, limit_shot } = req.body;
  const actualShot = actual_shot || 0
  const limitShot = limit_shot || 0
  try {
    if(!id_kanagata || actualShot || limitShot) {
      return handleResponse(res, 'All fields are required', 400)
    }

    const existingKanagata = await kanagataModel.findKanagataById(id_kanagata)
    if(existingKanagata[0]) {
      return handleResponse(res, 'Kanagata already exists', 400)
    }

    await kanagataModel.addKanagata(id_kanagata, actualShot, limitShot)
    handleResponse(res, 'Create new kanagata data successfully')
  } catch (error) {
    handleError(res,error)
  }
}

const updateKanagata = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_kanagata, actual_shot, limit_shot } = req.body;

    // Validasi key dan value pada request body
    if (!id_kanagata || !actual_shot || !limit_shot) {
      return handleResponse(res, 'All fields are required', 400)
    }
    // Validasi kanagata id yang ingin di update apakah ada pada table
    const checkOldKanagata = await kanagataModel.findKanagataById(id);
    if (!checkOldKanagata[0]) {
      return handleResponse(res, 'Kanagata with id: ' + id + ' not found', 404);
    }
    // Validasi new id pada req.body apakah ada duplicate primary key ?
    const checkNewKanagata = await kanagataModel.findKanagataById(id_kanagata)
    if(checkNewKanagata[0]){
      return handleResponse(res, 'Kanagata with id: ' + id_kanagata + ' already exist ', 400)
    }

    await kanagataModel.updateKanagataById(id, req.body);
    handleResponse(res, 'Update kanagata data successfully')
  } catch (error) {
    handleError(res, error)
  }
};

const getAllKanagatas = async(req, res) => {
  try {
    const kanagatas = await kanagataModel.getAllKanagata();
    const message = kanagatas.length === 0 ? 'No kanagata data available, add some kanagata data' : kanagatas;
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteKanagata = async(req, res) => {
  try {
    const checkKanagata = await kanagataModel.findKanagataById(req.params.id)
    if(!checkKanagata[0]){
      return handleResponse(res, 'Kanagata with id: ' +req.params.id+ ' is not found', 404)
    }
    const deleted = await kanagataModel.deleteKanagataById(req.params.id)
    const message = deleted ? 'Kanagata deleted successfully' : 'Kanagata not found'
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newKanagata,
  getAllKanagatas,
  deleteKanagata,
  updateKanagata
}