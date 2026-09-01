// const nodemailer=require('nodemailer')
// require('dotenv').config()

// const mailer=nodemailer.createTransport({
//     //service:'gmail',
//     host:'smtp-relay.brevo.com',
//     port:465,
//     secure:true,
//     pool:true,
//     maxConnections:1,
//     auth:{
//         user:process.env.BREVO_EMAIL_USER,
//         pass:process.env.BREVO_EMAIL_PASS
//     }
// })

// module.exports=mailer

const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_EMAIL_PASS; 

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOtpEmail = async (toEmail, otpCode) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Your OTP Code";
  sendSmtpEmail.htmlContent = `<h3>Your OTP Code for Registration</h3><br/><p>Your OTP code is: <strong>${otpCode}</strong></p><p><strong>NOTE:</strong><small>This otp will expire in 5minutes</small></p>`;
  sendSmtpEmail.sender = { 
    name: "Ecommerce-FSD", 
    email: process.env.EMAIL_USER 
  };
  sendSmtpEmail.to = [{ email: toEmail }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendOtpEmail;