const sendOTP = require("../mailer/sendOtp");

let otpStore = {}; 

async function register(req, res) {
  const { name, email, password } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = {
    otp: otp,
    name,
    password,
    expires: Date.now() + 5 * 60 * 1000
  };

  await sendOTP(email, otp);

  res.json({
    message: "OTP sent to email"
  });
}

module.exports = { register, otpStore };