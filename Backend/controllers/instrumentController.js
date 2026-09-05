const Instrument = require('../models/Instrument');
const QRCode = require('qrcode');
const crypto = require('crypto');

exports.createInstrument = async (req, res) => {
  try {
    const instrument = await Instrument.create({
      ...req.body, 
      trader: req.user.id, 
      status: 'PENDING'
    });
    res.json(instrument);
  } catch(e){ console.log(e); res.status(500).json({msg:'Error'}); }
};

exports.getInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find().populate('trader').sort({createdAt:-1});
    res.json(instruments);
  } catch(e){ res.status(500).json({msg:'Error'}); }
};

exports.updateStatus = async (req, res) => {
  try {
    const inst = await Instrument.findById(req.params.id);
    if(!inst) return res.status(404).json({msg:'Not found'});
    
    inst.status = req.body.status.toUpperCase();

    if(inst.status === 'APPROVED'){
      const certId = `WB-LM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random()*9000)}`;
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const dataToSign = `${certId}|${expiryDate.toISOString()}`;
      const signedHash = crypto.createHmac('sha256', process.env.QR_SECRET).update(dataToSign).digest('hex');
      const qrDataString = `${certId}|${expiryDate.toISOString()}|${signedHash}`;
      const qrImage = await QRCode.toDataURL(qrDataString);

      inst.certId = certId;
      inst.expiryDate = expiryDate;
      inst.signedHash = signedHash;
      inst.qrData = qrDataString;
      inst.qrCode = qrImage;
      inst.approvedBy = req.user.id;
    }
    await inst.save();
    res.json(inst);
  } catch(e){ console.log(e); res.status(500).json({msg:'Error'}); }
};

// FIXED VERIFY
exports.verifyCertificate = async (req, res) => {
  try {
    let { certId } = req.params;
    certId = certId.trim();
    console.log("VERIFY REQUEST:", certId);

    const inst = await Instrument.findOne({ certId: certId });
    console.log("DB RESULT:", inst ? "FOUND "+inst.certId : "NOT FOUND");
    
    if(!inst) return res.json({ valid: false, msg: 'Invalid Certificate', searched: certId });

    const dataToSign = `${inst.certId}|${inst.expiryDate.toISOString()}`;
    const expectedHash = crypto.createHmac('sha256', process.env.QR_SECRET).update(dataToSign).digest('hex');

    if(expectedHash !== inst.signedHash) {
      return res.json({ valid: false, msg: 'Tampered QR' });
    }
    if(new Date() > new Date(inst.expiryDate)) {
      return res.json({ valid: false, msg: 'Expired' });
    }
    res.json({ valid: true, msg: 'VALID', data: inst });
  } catch(e){ console.log("VERIFY ERROR:", e); res.status(500).json({ valid: false, msg: 'Server Error' }); }
};