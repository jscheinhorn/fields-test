const express = require('express')
const { join } = require('path')
const api = require('./api')
// const openBrowser = require('react-dev-utils/openBrowser')

const app = express()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use('/api', api)

app.listen(process.env.PORT || 8080, function() {
  console.log(`App listening on port!`)
})

// if (openBrowser('http://localhost:8080')) {
//   console.log('The browser tab has been opened!')
// }
