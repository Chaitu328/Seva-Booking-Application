const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (contact, otp) => {
  const expiresAt = Date.now() + 10 * 60 * 1000;
  otpStore.set(contact, { otp, expiresAt });
  console.log(`OTP for ${contact}: ${otp}`);
};

const verifyOTP = (contact, otp) => {
  const storedData = otpStore.get(contact);
  if (!storedData) return false;
  
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(contact);
    return false;
  }
  
  return storedData.otp === otp;
};

const deleteOTP = (contact) => {
  otpStore.delete(contact);
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  deleteOTP
};