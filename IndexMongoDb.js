// Import Express
const express = require('express')

// Initialize Express
const app = express()
app.use(express.json())

// Import Cors
const cors = require('cors')
app.use(cors())

// Import Mongoose
const mongoose = require('mongoose')

// Import .env
const dotenv = require('dotenv')
dotenv.config()

// Create Connection to Cluster MongoDb
mongoose.connect(process.env.MONGO_DB, {}, 
    (err) => {
        if(err) {
            return console.log(err)
        }

        console.log('Connected to Mongo Db')
    }
)

// Create Schema Models MongoDb
const todosSchema = new mongoose.Schema({
    todo: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    status_id: {
        type: Number, 
        required: true,
        default: 1
    },
    users_id: {
        type: String, 
        required: true
    },
    created_at: {
        type: Date, 
        required: true, 
        default: Date.now()
    }
})

// Create Schema
const todos = mongoose.model('todos', todosSchema)

// CRUD on MongoDb
// Create
app.post('/mongodb/create', (req, res) => {
    const data = req.body 
    console.log(data)

    try {
        if(!data.todo || !data.description || !data.users_id) throw { message: 'Data Not Complete!' }

        // Create New Data
        const newTodo = new todos({
            todo: data.todo, 
            description: data.description, 
            users_id: data.users_id
        })

        // Save Data Menuju MongoDb
        newTodo.save()
        .then((result) => {
            res.status(200).send({
                error: false, 
                message: 'Create Data Success!'
            })
        })
        
    } catch (error) {
        // error = { message: 'Data Not Complete!' }
        res.status(500).send({
            error: true, 
            message: error.message
        })
    }
})

// Read
// Get All Data
app.get('/mongodb/get', (req, res) => {
    todos.find()
    .then((result) => {
        res.status(200).send({
            error: false, 
            message: 'Get Data Success!',
            data: result
        })
    })
    .catch((error) => {
        res.status(500).send({
            error: true, 
            message: error.message
        })
    })
})

// Get Data by Id
app.get('/mongodb/getById/:idUser', (req, res) => {
    todos.findOne({ users_id: `${req.params.idUser}` })
    .then((result) => {
        if(result == null){
            // Response Bahwa Id Tidak Ditemukan / Data Tidak Ada
            res.status(200).send({
                error: false, 
                message: 'Get Data Failed! Data Not Found / Id Not Found!',
                data: result
            })
        }else{
            res.status(200).send({
                error: false, 
                message: 'Get Data Success!',
                data: result
            })
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

// Update
app.patch('/mongodb/update/:idUser', (req, res) => {
    console.log(req.params.idUser)
    todos.findOneAndUpdate({users_id: `${req.params.idUser}`}, req.body)
    .then((result) => {
        if(result == null){
            // Response Bahwa Id Tidak Ditemukan / Data Tidak Ada
            res.status(200).send({
                error: false, 
                message: 'Update Data Failed! Data Not Found / Id Not Found!'
            })
        }else{
            res.status(200).send({
                error: false, 
                message: 'Update Data Success!'
            })
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

// Delete
app.delete('/mongodb/delete/:idTodo', (req, res) => {
    todos.findByIdAndDelete(`${req.params.idTodo}`)
    .then((result) => {
        if(result == null){
            // Response Bahwa Id Tidak Ditemukan / Data Tidak Ada
            res.status(200).send({
                error: false, 
                message: 'Delete Data Failed! Data Not Found / Id Not Found!',
            })
        }else{
            res.status(200).send({
                error: false, 
                message: 'Delete Data Success!',
            })
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/', (req, res) => {
    res.status(200).send('API with MongoDb Databases')
})

app.listen(2000, () => console.log('API Running on PORT ' + 2000))