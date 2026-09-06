const express = require('express');
const router = express.Router();
const { createInstrument, getInstruments, updateStatus, verifyCertificate } = require('../controllers/instrumentController');
const auth = require('../middleware/auth');

router.get('/verify/:certId', verifyCertificate);
router.get('/', getInstruments);
router.put('/:id/status', updateStatus);
router.post('/', auth, createInstrument);

module.exports = router;