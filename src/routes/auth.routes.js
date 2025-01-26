const express = require('express')

const AuthController = require('../controller/user.controller')
const authMiddleware = require('../middleware/auth.middleware')

const AuthRouter = express.Router()

AuthRouter.post('/update-user', authMiddleware, AuthController.updateUser)

AuthRouter.post('/signup', AuthController.onboardUser)

AuthRouter.post('/login', AuthController.loginUser)

AuthRouter.get('/fetch-all', AuthController.fetchAllUsers)

module.exports = AuthRouter
