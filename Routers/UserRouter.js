const { Route } = require('express')
const express = require('express')
const Router = express.Router()

// Import Controller Todos
const UserController = require('./../Controllers/UserController')

// Import JWT Verify
const jwtVerify = require('./../Middleware/JWT')

Router.post('/register', UserController.register)
Router.patch('/confirmation', UserController.confirmation)
Router.post('/login', UserController.login)
Router.post('/checkuserverify', jwtVerify, UserController.checkUserVerify)

module.exports = Router