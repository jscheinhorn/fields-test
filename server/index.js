const express = require('express')
const { join } = require('path')
const api = require('./api')
const app = express()
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use('/api', api)

app.listen(process.env.PORT || 8080, function() {
  console.log(`App listening on port!`)
})
