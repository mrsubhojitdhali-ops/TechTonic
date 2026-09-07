const mongoose = require('mongoose');
const Instrument = require('../models/Instrument');
const QRCode = require('qrcode');
const crypto = require('crypto');

const publicBase = () => process.env.PUBLIC_APP_URL || 'http://localhost:3000';

exports.createInstrument = async (req, res) => {
  try {
    if (req.user.role!== 'trader') return res.status(403).json({ msg: 'Only traders can submit instruments' });
    const { name, type, price, capacity, model, serialNo } = req.body;
    if (!name?.trim()) return res.status(400).json({ msg: 'Instrument name is required' });
    if (!mongoose.isValidObjectId(req.user.id)) return res.status(401).json({ msg: 'Invalid user identity' });

    const item = await Instrument.create({
      name: name.trim(), type: type || 'Electronic Scale', price: Number(price) || 0,
      capacity, model, serialNo, trader: req.user.id, status: 'PENDING'
    });
    res.status(201).json(await item.populate('trader', 'name email role'));
  } catch (err) {
    console.error('Create instrument error:', err);
    res.status(500).json({ msg: 'Could not submit application', error: err.message });
  }
};

exports.getInstruments = async (req, res) => {
  try {
    const query = req.user.role === 'trader'? { trader: req.user.id } : {};
    const instruments = await Instrument.find(query).populate('trader', 'name email role').populate('approvedBy', 'name email').sort({ createdAt: -1 });
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ msg: 'Could not load applications', error: err.message });
  }
};

exports.getPublicStats = async (_req, res) => {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      Instrument.countDocuments(),
      Instrument.countDocuments({ status: 'APPROVED' }),
      Instrument.countDocuments({ status: 'PENDING' }),
      Instrument.countDocuments({ status: 'REJECTED' })
    ]);
    res.json({ total, approved, pending, rejected });
  } catch (err) { res.status(500).json({ msg: 'Stats unavailable' }); }
};

exports.getPublicList = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status!== 'all'? { status: status.toUpperCase() } : {};
    const data = await Instrument.find(filter).populate('trader', 'name email').sort({ createdAt: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: 'List unavailable', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role!== 'inspector' && req.user.role!== 'admin') return res.status(403).json({ msg: 'Only inspectors can update inspection status' });
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(req.body.status)) return res.status(400).json({ msg: 'Invalid status' });
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) return res.status(404).json({ msg: 'Application not found' });

    if (req.body.status === 'APPROVED') {
      const certId = `WB-LM-${new Date().getFullYear()}-${crypto.randomInt(100000, 999999)}`;
      const qrData = `${publicBase()}/verify/${certId}`;
      instrument.certId = certId;
      instrument.qrData = qrData;
      instrument.qrCode = await QRCode.toDataURL(qrData, { margin: 1, width: 280 });
      instrument.signedHash = crypto.createHash('sha256').update(`${certId}|${instrument._id}|${instrument.trader}|${process.env.QR_SIGNING_SECRET || process.env.JWT_SECRET || 'change-this-secret'}`).digest('hex');
      const expiry = new Date(); expiry.setFullYear(expiry.getFullYear() + 1);
      instrument.expiryDate = expiry;
      instrument.approvedBy = req.user.id;
    } else {
      instrument.certId = undefined; instrument.qrData = undefined; instrument.qrCode = undefined;
      instrument.signedHash = undefined; instrument.expiryDate = undefined; instrument.approvedBy = undefined;
    }

    instrument.status = req.body.status;
    await instrument.save();
    res.json(await instrument.populate(['trader', 'approvedBy']));
  } catch (err) {
    res.status(500).json({ msg: 'Could not update application', error: err.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certId = String(req.params.certId || '').trim().toUpperCase();
    const item = await Instrument.findOne({ certId }).populate('trader', 'name email').populate('approvedBy', 'name email');
    if (!item) return res.status(404).json({ valid: false, status: 'NOT_FOUND', msg: 'Certificate not found' });
    if (item.status!== 'APPROVED') return res.json({ valid: false, status: item.status, data: item, msg: `Certificate is ${item.status.toLowerCase()}` });
    if (item.expiryDate && new Date(item.expiryDate) < new Date()) return res.json({ valid: false, status: 'EXPIRED', data: item, msg: 'Certificate has expired' });
    res.json({ valid: true, status: 'VALID', data: item });
  } catch (err) { res.status(500).json({ valid: false, msg: 'Verification failed', error: err.message }); }
};