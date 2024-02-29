const express = require('express');
const router = express.Router();
const finalStatusController = require('../controllers/finalStatusController')

router.get('/', finalStatusController.getAllFinalStatus)
router.get('/date', finalStatusController.getFinalStatusWithDateRange)
router.get('/count', finalStatusController.getCountFinalStatusByMachine)

module.exports = router