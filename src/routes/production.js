const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');

// GET - ALL PRODUCTIONS
router.get('/', productionController.getAllProduction);
router.get('/date', productionController.getProductionByDate);
router.get('/product', productionController.getProductionByIdProduct);
router.get('/machine', productionController.getProductionByIdMachine);


module.exports = router