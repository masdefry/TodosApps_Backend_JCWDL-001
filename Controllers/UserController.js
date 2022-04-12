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
            if(!data.username || !data.email || !data.password) throw { message: 'Data Not Completed!' }
            if(!validator.isEmail(data.email)) throw { message: 'Email Invalid' }
            if(data.password.length > 10) throw { message: 'Password Maximum 10 Character' }

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

            // Step4.2.
            let code_activation = Math.round(Math.random() * 100000)
            data.code_activation = code_activation

            // Step4.3. Store ke Db
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
                    const newTemplateResult = newTemplate({bebas: data.email, link:`http://localhost:3000/confirmation/${insertUser.insertId}`, code_activation: code_activation, link_activation_code: `http://localhost:3000/confirmationcode/${insertUser.insertId}`})

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
    },

    confirmation: (req, res) => {
        // Step1. Get id
        console.log(req.body)
        const id = req.body.id 
        const code_activation = req.body.code_activation
        console.log(code_activation)

        // Step2.0. Check, apakah user melakukan aktivasi via link atau menggunakan activation code
        if(code_activation !== undefined){ // Apablia aktivasi menggunakan code
            db.query('SELECT * FROM users WHERE id = ? AND code_activation = ? AND is_confirmed = 0', [id, code_activation], (err, result) => {
                try {
                    if(err) throw err 

                    if(result.length === 0){
                        res.status(400).send({
                            error: true, 
                            message: 'Id Not Found / Email Already Active / Code Activation Wrong'
                        })
                    }else{
                        // Step3. Apabila is_confirmed = 0, update menjadi = 1
                        db.query('UPDATE users SET is_confirmed = 1 WHERE id = ?', id, (err1, result1) => {
                            try {
                                if(err) throw err 

                                res.status(200).send({
                                    error: false, 
                                    message: 'Your Account Active!'
                                })
                            } catch (error) {
                                res.status(500).send({
                                    error: true, 
                                    message: error.message
                                })
                            }
                        })
                    }
                } catch (error) {
                    res.status(500).send({
                        error: true, 
                        message: error.message
                    })
                }
            })
        }else{ // Apabila aktivasi menggunakan link
            // Step2. Check, apakah id nya exist & is_confirmed masih = 0
            db.query('SELECT * FROM users WHERE id = ? AND is_confirmed = 0', id, (err, result) => {
                try {
                    if(err) throw err 

                    if(result.length === 0){
                        res.status(400).send({
                            error: true, 
                            message: 'Id Not Found / Email Already Active'
                        })
                    }else{
                        // Step3. Apabila is_confirmed = 0, update menjadi = 1
                        db.query('UPDATE users SET is_confirmed = 1 WHERE id = ?', id, (err1, result1) => {
                            try {
                                if(err) throw err 

                                res.status(200).send({
                                    error: false, 
                                    message: 'Your Account Active!'
                                })
                            } catch (error) {
                                res.status(500).send({
                                    error: true, 
                                    message: error.message
                                })
                            }
                        })
                    }
                } catch (error) {
                    res.status(500).send({
                        error: true, 
                        message: error.message
                    })
                }
            })
        }
    }
}