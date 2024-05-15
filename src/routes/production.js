const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');

// GET - ALL PRODUCTIONS
router.get('/', productionController.getAllProduction);
router.get('/date', productionController.getProductionByDate);
router.get('/date/trend', productionController.getTrendProductionByDate);
router.get('/date/ppm', productionController.getPpmByDate);
router.get('/monthly', productionController.getProductionByMachineMonth);
router.get('/monthly/total', productionController.getTotalProductionAllMachineByMonth);
router.get('/product', productionController.getProductionByIdProduct);
router.get('/machine', productionController.getProductionByIdMachine);
router.get('/fiscal', productionController.getFiscalProductionByYearMonth)

router.patch('/:id', productionController.updateProduction);


module.exports = router