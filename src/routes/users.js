// routes/users.js
const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/userController');
const middlewareHandle = require('../middleware/middlewareHandle.js')

const router = express.Router();

// PATCH - UPDATE
router.patch('/password', usersController.changePassword);

// POST - CREATE
router.post('/signup', [
  check('username', 'Please enter a username').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], usersController.createNewUser);

// router.post('/signup', usersController.createNewUser);

// GET - READ
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);

// DELETE - DELETE
router.delete('/:id', usersController.deleteUser)

module.exports = router;