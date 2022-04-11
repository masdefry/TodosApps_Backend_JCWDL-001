const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'recordingmasdefry1@gmail.com', // Email Sender
        pass: 'ztsyipilivperaqy' // Key Generate
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter