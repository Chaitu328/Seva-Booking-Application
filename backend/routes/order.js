const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }

    if (!address || !address.pincode) {
      return res.status(400).json({ message: 'Valid address with pincode is required' });
    }

    const amountToPay = items.reduce((total, seva) => {
      return total + (seva.discountedPrice || 0);
    }, 0);

    const response = {
      orderId: Math.floor(100000 + Math.random() * 900000),
      paymentId: Math.floor(1000000000 + Math.random() * 9000000000),
      amountToPay: amountToPay
    };

    console.log('Order processed:', {
      orderId: response.orderId,
      itemCount: items.length,
      amount: amountToPay,
      address: `${address.addrLine1}, ${address.city}`
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('Order processing error:', error);
    res.status(500).json({ message: 'Internal server error during order processing' });
  }
});

module.exports = router;