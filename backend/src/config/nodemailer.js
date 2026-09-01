const nodemailer=require('nodemailer')
require('dotenv').config()

const mailer=nodemailer.createTransport({
    //service:'gmail',
    host:'smtp-relay.brevo.com',
    port:465,
    secure:true,
    pool:true,
    maxConnections:1,
    auth:{
        user:process.env.BREVO_EMAIL_USER,
        pass:process.env.BREVO_EMAIL_PASS
    }
})

module.exports=mailer