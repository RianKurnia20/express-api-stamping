const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');

// GET - ALL PRODUCTIONS
router.get('/', productionController.getAllProduction);
router.get('/filter', productionController.getAllProductionFilterMachineMonth);
router.get('/date', productionController.getProductionByDate);
router.get('/date/trend', productionController.getTrendProductionByDate);
router.get('/date/ppm', productionController.getPpmByDate);
router.get('/date/oee', productionController.getDailyOee);
router.get('/monthly', productionController.getProductionByMachineMonth);
router.get('/monthly/total', productionController.getTotalProductionAllMachineByMonth);
router.get('/monthly/oee', productionController.getSummaryMonthlyOee);
router.get('/product', productionController.getProductionByIdProduct);
router.get('/machine', productionController.getProductionByIdMachineYesterday);
router.get('/fiscal', productionController.getFiscalProductionByYearMonth)
router.get('/fiscal/sales', productionController.getSummarySalesAndRejectCost)

router.patch('/:id', productionController.updateProduction);
router.post('/', productionController.createProduction)

module.exports = router