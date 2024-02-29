const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');

router.post('/', productController.newProduct)

router.patch('/:id', productController.updateProduct)

router.get('/', productController.getAllProducts)

router.delete('/:id', productController.deleteProduct)

module.exports = router;