const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const problemController = require('../controllers/problemController.js')

router.post('/',
  [
    check('id_problem', 'Please enter a problem id').optional().not().isEmpty(),
    check('name', 'Please enter a problem name').optional().not().isEmpty(),
  ],
  problemController.newProblem
)

router.get('/', problemController.getAllProblem);

router.patch('/:id',
  [
    check('id_problem', 'Please enter a problem id').trim().not().isEmpty(),
    check('name', 'Please enter a problem name').optional().trim().not().isEmpty(),
  ],
  problemController.updateProblem
)

router.delete('/:id', problemController.deleteProblem)

module.exports = router