const mongoose = require('mongoose');

const sevaSchema = new mongoose.Schema({
  id: {type:Number, required: true, unique: true},
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tags: [String],
  description: { type: String, required: true },
  marketPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  amountRaised: { type: Number, default: 0 },
  targetAmount: { type: Number, required: true },
  media: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Seva', sevaSchema);