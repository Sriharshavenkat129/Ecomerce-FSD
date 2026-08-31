const nodemailer=require('nodemailer')
require('dotenv').config()

const mailer=nodemailer.createTransport({
    //service:'gmail',
    host:'smtp.gmail.com',
    secure:true,
    port:465,
    pool:true,
    maxConnections:1,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

module.exports=mailer