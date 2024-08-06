const express = require('express');
const router = express.Router()
const maintenancePartController = require('../controllers/maintenancePartController');

router.get('/', maintenancePartController.getAllMaintenancePartByMachine)
router.get('/date',maintenancePartController.getMaintenancePartByDateRangeAndMachine)

module.exports = router