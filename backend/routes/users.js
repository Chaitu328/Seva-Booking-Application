const express = require('express');
const User = require('../models/User');
const { generateOTP, storeOTP, verifyOTP, deleteOTP } = require('../utils/otpService');
const router = express.Router();

router.get('/identity-exist', async (req, res) => {
  try {
    const { contact } = req.query;
    const user = await User.findOne({ contact });
     res.json({ exists: !!user, user: user ? { id: user.id } : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findOne({ id: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/otp', async (req, res) => {
  try {
    const { contact } = req.body;
    const otp = generateOTP();
    storeOTP(contact, otp);
    res.json({ message: 'OTP sent successfully',otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/otp-verify', async (req, res) => {
  try {
    const { contact, otp } = req.body;
    const isValid = verifyOTP(contact, otp);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    deleteOTP(contact);
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { contact, name } = req.body;
    
    const userExists = await User.findOne({ contact });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ contact, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;