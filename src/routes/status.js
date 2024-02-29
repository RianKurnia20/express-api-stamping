const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController.js');

router.get('/', statusController.getAllStatus)

module.exports = router;