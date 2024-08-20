const express = require('express')
const router = express.Router();
const planController = require('../controllers/planController')

router.post('/', planController.newPlan)
router.get('/',  planController.getAllPlan)
router.get('/pca', planController.searchPlanByIdPca)
router.patch('/:id', planController.updatedPlan)
router.delete('/:id', planController.deletePlan)
module.exports = router