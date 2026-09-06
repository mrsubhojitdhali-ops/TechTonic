const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Frontend theke /signup ba /register jai asuk cholbe
router.post('/signup', authController.register);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;