const express = require('express');
const Seva = require('../models/Seva');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sevas = await Seva.find();
    res.json(sevas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const seva = await Seva.findOne({ code: req.params.code });
    if (!seva) {
      return res.status(404).json({ message: 'Seva not found' });
    }
    res.json(seva);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;