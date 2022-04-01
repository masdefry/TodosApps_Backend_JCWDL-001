// Import Moduls
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

// Initialize Express 
const app = express() // Untuk membuat server API
app.use(express.json()) // Body Parser : Untuk menerima data dari frontend

// Initialize MySql : Create Connection
const db = mysql.createConnection({
    user: 'root',
    password: '20121995',
    database: 'todos',
    port: 3306
})

// Initialize PORT
const PORT = 3001

// Initialize Cors
app.use(cors()) // Kita memberikan izin ke semua client 

// app.use(cors({
//     origin: 'http://localhost:3000'
// }))

// Create
app.post('/create', (req, res) => {
    try {
        // Step1.1. Menerima req.body dari frontend
    const data = req.body 

    // Step1.2 Validasi data
    if(!data.todo || !data.description || !data.status || !data.users_id) throw {
        status: 400,
        error: true, 
        message: 'Data Not Completed!'
    }

    // Step2.1. Define query insert
    const sqlQuery1 = 'INSERT INTO todos SET ?'
    // Step2.2. Define query get
    const sqlQuery2 = 'SELECT * FROM todos'

    // Step3. Jalankan query insert
    db.query(sqlQuery1, data, (err, result) => {
        try {
            if(err) throw err

            db.query(sqlQuery2, (err1, result1) => {
                try {
                    if(err1) throw err1

                    res.status(201).send({
                        status: 201, 
                        error: false,
                        message: 'Post Data Success!',
                        data: result1
                    })
                } catch (error) {
                    console.log(error)
                }
            })
        } catch (error) {
            console.log(error)
        }
    })
    } catch (error) {
        res.status(error.status).send({
            status: error.status,
            error: true,
            message: error.message
        })
    }
})

app.listen(PORT, () => console.log('API Running on PORT ' + PORT) )