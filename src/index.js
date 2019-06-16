const winston = require('winston')
const express = require('./core/express')

const app = express.init()
const port = process.env.PORT || 3000

global.logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

app.listen(port, () => {
  global.logger.info('Server Listening', { port })
})
