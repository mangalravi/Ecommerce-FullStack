import dotenv from "dotenv"
dotenv.config()
import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)
// console.log("Twilio Client SID:", process.env.TWILIO_ACCOUNT_SID)
client.messages
  .create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: +916350428940,
  })
  .then((msg) => console.log(msg.sid))
  .catch((err) => console.error(err))
