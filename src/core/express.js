const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

const { logRequest } = require('../utils')
const { initRoutes } = require('../routes/api')

dotenv.config()

/**
 * Initialize the Express application
 */
function init() {
  // Initialize express app
  const app = express()

  // Initialize Express middleware
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // Log all error requests
  app.use((err, request, response, next) => {
    logRequest(err, request, response)
    next()
  })

  // Log all requests
  app.use((request, response, next) => {
    logRequest(null, request, response)
    next()
  })

  // Configure the module routes
  initRoutes(app)

  // app.use('*', (req, res) => {
  //  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  // })

  return app
}

module.exports = { init }
