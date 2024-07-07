const nodemailer = require('nodemailer');
require('dotenv').config();

const send_mail = (email_id,otp)=>{

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.MAIL_ID,
        to: email_id,
        subject: "OTP for signup",
        text: `OTP : ${otp}`
    }
   
    return transporter.sendMail(mailOptions);

}
module.exports= send_mail; 