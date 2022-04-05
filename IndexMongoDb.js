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
            console.log(result)
        })
        
    } catch (error) {
        // error = { message: 'Data Not Complete!' }
        res.status(500).send({
            error: true, 
            message: error.message
        })
    }
})

app.get('/', (req, res) => {
    res.status(200).send('API with MongoDb Databases')
})

app.listen(2000, () => console.log('API Running on PORT ' + 2000))