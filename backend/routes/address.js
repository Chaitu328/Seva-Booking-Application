const express = require('express');
const router = express.Router();

const pincodeData = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' }
};

router.get('/address-by-pincode/:pincode', (req, res) => {
  const { pincode } = req.params;
  const data = pincodeData[pincode];
  
  if (!data) {
    return res.status(404).json({ message: 'Pincode not found' });
  }
  
  res.json(data);
});

module.exports = router;