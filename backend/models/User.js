const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    contact: { type: String, required: true, unique: true },
    name: { type: String }
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastUser = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = lastUser ? lastUser.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
