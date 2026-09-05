const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/register', controller.register);
router.post('/login', controller.login);

// FIX: Inspector/Trader login er jonno same login use hobe
router.post('/inspector/login', controller.login);
router.post('/trader/login', controller.login);

module.exports = router;