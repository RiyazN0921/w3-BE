const express = require('express')

const AuthRouter = require('./auth.routes')

const MainRouter = express.Router()

MainRouter.get('/status', (req, res) => {
  res.json({ message: 'server is live' })
})

MainRouter.use('/auth', AuthRouter)

module.exports = MainRouter
