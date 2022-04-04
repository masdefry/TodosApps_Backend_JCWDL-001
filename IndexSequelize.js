// Import Moduls
const express = require('express')
const cors = require('cors')

// Initialize Express 
const app = express() // Untuk membuat server API
app.use(express.json()) // Body Parser : Untuk menerima data dari frontend

// Initialize PORT
const PORT = 3001

// Initialize Cors
app.use(cors()) // Kita memberikan izin ke semua client 

// app.use(cors({
//     origin: 'http://localhost:3000'
// }))

// Initialize Sequelize
const db = require('./Models/Index')
const users = db.users

// Create
app.post('/seq/create', async(req, res) => {
    try {
        const post = await users.create(req.body)

        res.status(200).send({
            error: false, 
            message: 'Create Data Success!'
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
})

// Get
app.get('/seq/getAllData', async(req, res) => {
    try {
        const get = await users.findAll()

        if(get.length === 0){
            // Kirim respon "Data Tidak Ada!"
        }else{
            res.status(200).send({
                error: false, 
                message: 'Get Data Success!',
                data: get
            })
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
})

app.get('/seq/getById/:idUser', async(req, res) => {
    try {
        const idUser = req.params.idUser
        const get = await users.findAll({
            where: {
                id: idUser
            }
        })

        if(get.length === 0){
            // Kirim respon "User Tidak Ditemukan!"
        }else{
            res.status(200).send({
                error: false, 
                message: 'Get Data Success!',
                data: get
            })
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
})

// Update
app.patch('/seq/update', async(req, res) => {
    try {
        const data = req.body 
        const idUser = req.query.idUser 

        const update = await users.update({username: data.username}, {
            where:{
                id: idUser
            }
        })

        res.status(200).send({
            error: false, 
            message: 'Update Data Success!'
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
})

// Delete
app.delete('/seq/delete', async(req, res) => {
    try {
        const idUser = req.query.idUser 

        const del = await users.destroy({
            where:{
                id: idUser
            }
        })

        res.status(200).send({
            error: false, 
            message: 'Delete Data Success!'
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
})

app.listen(PORT, () => console.log('API Running on PORT ' + PORT) )

// npm i sequelize sqlite3 mysql2