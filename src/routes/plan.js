const express = require('express')
const router = express.Router();
const planController = require('../controllers/planController')

router.post('/', planController.newPlan)
router.get('/',  planController.getAllPlan)

module.exports = router