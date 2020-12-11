const express = require('express')
const { join } = require('path')
const api = require('./api')
const webhook = require('./webhookalt')
const app = express()
require('dotenv').config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use('/api', api)
app.use('/webhooks', webhook.verifyWebhook)
app.post('/webhook', webhook.orderApproved)

webhook.setupWebhooks()

app.listen(process.env.PORT || 8080, function() {
  console.log(`App listening on port!`)
})
