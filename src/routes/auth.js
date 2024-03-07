// routes/auth.js
const express = require('express');
const userController = require('../controllers/authController.js')

const router = express.Router();

router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

router.post('/validate', userController.validateToken);

module.exports = router;
