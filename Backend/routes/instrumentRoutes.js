const express = require('express');
const router = express.Router();
const { createInstrument, getInstruments, getPublicStats, getPublicList, updateStatus, verifyCertificate } = require('../controllers/instrumentController');
const Instrument = require('../models/Instrument'); // permanent delete er jonno
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.get('/verify/:certId', verifyCertificate);
router.get('/stats/public', getPublicStats);
router.get('/public/list', getPublicList);

router.get('/', auth, getInstruments);
router.post('/', auth, roles('trader'), createInstrument);
router.put('/:id/status', auth, roles('inspector', 'admin'), updateStatus);

// NEW - Permanent Reject + 15 days auto delete er jonno
router.delete('/:id', auth, roles('inspector', 'admin'), async (req, res) => {
  try {
    const deleted = await Instrument.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Instrument not found' });
    res.json({ msg: 'Permanently deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Delete failed' });
  }
});

module.exports = router;