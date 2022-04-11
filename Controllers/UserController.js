// Import Connection
const db = require('./../Connection/Connection');
const util = require('util')
const query = util.promisify(db.query).bind(db)

// Import Validator
const validator = require('validator')

// Import Crypto 
const crypto = require('crypto')

// Import Transporter Nodemailer
const transporter = require('./../Helpers/Transporter')

const fs = require('fs')
const handlebars = require('handlebars')

module.exports = {
    register: async(req, res) => {
        try {
            // Step1. Get All Data
        let data = req.body

        // Step2. Validasi
        if(!data.email || !data.password) throw { message: 'Data Not Completed!' }
        if(!validator.isEmail(data.email)) throw { message: 'Email Invalid' }

        // Step3. Hashing Password
        const hmac = crypto.createHmac('sha256', 'abc123')
        await hmac.update(data.password)
        const passwordHashed = await hmac.digest('hex')
        data.password = passwordHashed

        // Step4.1. Validasi, apakah emailnya sudah ter-register?
            let query1 = 'SELECT * FROM users WHERE email = ?'
            const findEmail = await query(query1, data.email)
            .catch((error) => {
                throw error
            })

            if(findEmail.length > 0){
                throw { message: 'Email Already Register!' }
            }

        // Step4.2. Store ke Db
        let query2 = 'INSERT INTO users SET ?'
        const insertUser = await query(query2, data)
        .catch((error) => {
            throw error
        })

        // Step5. Send Email Confirmation
        fs.readFile('D:/Workspace/Class/JCWDL-001/Backend/TodosApps/Public/Template/index.html', {
            encoding: 'utf-8'}, (err, file) => {
                if(err) throw err 

                const newTemplate = handlebars.compile(file)
                const newTemplateResult = newTemplate({bebas: data.email})

                transporter.sendMail({
                    from: 'masdefry', // Sender Address 
                    to: 'ryan.fandy@gmail.com', // Email User
                    subject: 'Email Confirmation',
                    html: newTemplateResult
                })
                .then((response) => {
                    res.status(200).send({
                        error: false, 
                        message: 'Register Success! Check Email to Verified Account!'
                    })
                })
                .catch((error) => {
                    res.status(500).send({
                        error: false, 
                        message: error.message
                    })
                })
            })
        } catch (error) {
            res.status(500).send({
                error: true, 
                message: error.message
            })
        }
    }
}