// Import Connection
const db = require('./../Connection/Connection');
const util = require('util')
const query = util.promisify(db.query).bind(db)

// Import Validator
const validator = require('validator')

// Import Crypto 
const crypto = require('crypto')

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

        res.status(200).send({
            error: false, 
            message: 'Register Success!'
        })
        // Step5. Send Email Confirmation
        } catch (error) {
            res.status(400).send({
                error: true, 
                message: error.message
            })
        }
    }
}