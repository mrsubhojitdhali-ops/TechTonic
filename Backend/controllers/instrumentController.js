const Instrument = require('../models/Instrument');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Trader add korle PENDING hoye save
exports.createInstrument = async (req, res) => {
  try {
    const { name, type, price } = req.body;
    if (!name) return res.status(400).json({ msg: "Name required" });

    const newItem = await Instrument.create({
      name,
      type: type || "Electronic Scale",
      price: Number(price) || 5000,
      trader: req.user.id,
      status: 'PENDING'
    });

    const populated = await newItem.populate('trader', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Trader = nijer ta, Inspector = sob ta
exports.getInstruments = async (req, res) => {
  try {
    let query = {};
    // jodi role trader hoy tahole sudhu tar ta
    if (req.user.role === 'trader' || req.user.role === 'TRADER') {
      query = { trader: req.user.id };
    }
    const instruments = await Instrument.find(query)
      .populate('trader', 'name email role')
      .sort({ createdAt: -1 });
      
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve + QR Generate
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) return res.status(404).json({ msg: "Not found" });

    if (status === 'APPROVED') {
      const certId = `WB-LM-${Date.now()}`;
      const qrDataString = `https://techtonic-v8.vercel.app/verify/${certId}`;
      const qrCodeImage = await QRCode.toDataURL(qrDataString);

      instrument.certId = certId;
      instrument.qrData = qrDataString;
      instrument.qrCode = qrCodeImage;
      instrument.signedHash = crypto.createHash('sha256').update(qrDataString).digest('hex');
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      instrument.expiryDate = expiry;
      instrument.approvedBy = req.user.id;
    }

    instrument.status = status;
    await instrument.save();
    const updated = await instrument.populate('trader', 'name email');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const item = await Instrument.findOne({ certId: req.params.certId }).populate('trader', 'name email');
    if (!item) return res.status(404).json({ valid: false });
    res.json({ valid: true, data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};