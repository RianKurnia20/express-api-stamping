const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const machineController = require('../controllers/machineController.js')

router.post('/',
  [
    check('id_machine', 'Please enter a machine id').optional().not().isEmpty(),
    check('address', 'Please enter a machine name').optional().not().isEmpty(),
  ],
  machineController.newMachine)

router.patch('/:id', machineController.updateMachine);

router.get('/', machineController.getAllMachines)

router.delete('/:id', machineController.deleteMachine)

module.exports = router;