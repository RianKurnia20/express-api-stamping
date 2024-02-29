const express = require('express');
const router = express.Router();
const pcaController = require('../controllers/pcaController');

router.get('/', pcaController.getAllPca)
router.patch('/:id', pcaController.updatePca)
router.delete('/:id', pcaController.deletePca)
router.post('/', pcaController.newPca)

module.exports = router;