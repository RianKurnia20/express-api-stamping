const machineModel = require('../models/machineModel.js');

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

const newMachine = async (req, res) => {
  const { id_machine, address } = req.body;
  try {
    // Cek apakah id_machine sudah ada di database
    if(!id_machine || !address){
      return handleResponse(res, 'All fields are required', 400);
    }

    const existingMachine = await machineModel.getMachineById(id_machine);
    if (existingMachine[0]) {
      return handleResponse(res, 'Machine ID already exists', 400); // Menggunakan return di sini
    }


    // Tambahkan mesin baru jika tidak ada konflik
    await machineModel.addMachine(id_machine, address);
    handleResponse(res, 'Create machine data successfully');
  } catch (error) {
    handleError(res, error);
  }
};

const updateMachine = async (req, res) => {
  try {
    const { actual_shot, limit_shot, shift, address } = req.body;
    if(actual_shot === undefined || limit_shot === undefined || address === undefined) {
      return handleResponse(res, 'All fields are required', 400)
    }
    await machineModel.updateMachineById(req.params.id, req.body);
    handleResponse(res, 'Update machine data successfully');
  } catch (error) {
    handleError(res, error);
  }
};

const getAllMachines = async (req, res) => {
  try {
    const machines = await machineModel.getAllMachine();
    const data = machines.length === 0 ? 'No machines data available, Add some machines data' : machines;
    handleResponse(res, 'Success', 200, data);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteMachine = async (req, res) => {
  try {
    const deleted = await machineModel.deleteMachineById(req.params.id);
    const message = deleted ? 'Machine deleted successfully' : 'Machine not found';
    handleResponse(res, message);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  newMachine,
  updateMachine,
  getAllMachines,
  deleteMachine
};
