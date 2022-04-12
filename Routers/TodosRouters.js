const { Route } = require('express')
const express = require('express')
const Router = express.Router()

// Import Controller Todos
const TodosControllers = require('./../Controllers/TodosControllers')

// Import JWT Verify
const jwtVerify = require('./../Middleware/JWT')

Router.post('/create', jwtVerify, TodosControllers.create)
Router.get('/getAllData', jwtVerify, TodosControllers.getAllData)

module.exports = Router