// Email

// notification

// otp
export const SendOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = (otp: number, to: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  const respons = client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_NUMBER,
    to: `+20${to}`,
  });

  return respons;
};

// payment notification or emails
