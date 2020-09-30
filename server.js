const express = require('express')
const { join } = require('path')
// const openBrowser = require('react-dev-utils/openBrowser')

const app = express()

app.use(express.static('public'))

app.listen(process.env.PORT || 8080, function() {
  console.log(`App listening on port!`)
})

// if (openBrowser('http://localhost:8080')) {
//   console.log('The browser tab has been opened!')
// }
