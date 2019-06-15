const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const router = require('../routes/api')

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

  // Initialize error routes
  app.use((err, req, res, next) => {
    global.logger.error(err.message, { stack: err.stack })
    next()
  })

  // Configure the server routes
  router.initRoutes(app)

  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })

  return app
}

module.exports = { init }
