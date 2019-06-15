const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

app.use((err, req, res, next) => {
  console.log(err)
  next()
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
