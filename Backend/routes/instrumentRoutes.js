const express = require('express');
const router = express.Router();
const { createInstrument, getInstruments, updateStatus, verifyCertificate } = require('../controllers/instrumentController');
const auth = require('../middleware/auth');

// 1. PUBLIC VERIFY - Sobar age rakhlam
router.get('/verify/:certId', verifyCertificate);

// 2. Trader & Inspector routes
router.post('/', auth, createInstrument);
router.get('/', auth, getInstruments);
router.put('/:id/status', auth, updateStatus);

module.exports = router;