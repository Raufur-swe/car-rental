import twilio from "twilio";

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_ACCOUNT_TOKEN,
    process.env.TWILIO_PHONE_NUMBER,

);

export default client;