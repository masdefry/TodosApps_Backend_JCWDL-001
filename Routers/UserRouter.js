const { Route } = require('express')
const express = require('express')
const Router = express.Router()

// Import Controller Todos
const UserController = require('./../Controllers/UserController')

Router.post('/register', UserController.register)

module.exports = Router