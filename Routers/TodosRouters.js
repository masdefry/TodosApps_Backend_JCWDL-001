const { Route } = require('express')
const express = require('express')
const Router = express.Router()

// Import Controller Todos
const TodosControllers = require('./../Controllers/TodosControllers')

Router.post('/create', TodosControllers.create)
Router.get('/getAllData', TodosControllers.getAllData)

module.exports = Router