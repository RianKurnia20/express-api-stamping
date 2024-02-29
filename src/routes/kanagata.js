const express = require('express');
const router = express.Router();
const kanagataController = require('../controllers/kanagataController');
const middlewareHandle = require('../middleware/middlewareHandle');

router.post('/', kanagataController.newKanagata)

router.patch('/:id', kanagataController.updateKanagata)


router.get('/', kanagataController.getAllKanagatas)

router.delete('/:id', kanagataController.deleteKanagata)

module.exports = router;