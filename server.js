const express = require('express')
const { join } = require('path')
const openBrowser = require('react-dev-utils/openBrowser')

const app = express()

app.use(express.static('public'))

app.listen(8080)

if (openBrowser('http://localhost:8080')) {
  console.log('The browser tab has been opened!')
}
