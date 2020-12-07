const express = require('express')
const { join } = require('path')
const api = require('./api')
const webhook = require('./webhookalt')
const app = express()
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use('/api', api)
app.post('/webhook', webhook.orderApproved)

webhook.setupWebhooks()

app.listen(process.env.PORT || 8080, function() {
  console.log(`App listening on port!`)
})
