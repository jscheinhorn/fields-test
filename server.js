const express = require('express')
const { join } = require('path')
const openBrowser = require('react-dev-utils/openBrowser')

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(join(__dirname, 'views/index.html')))

app.get('/ideal', (req, res) =>
  res.sendFile(join(__dirname, 'views/ideal.html')),
)
app.get('/sofort', (req, res) =>
  res.sendFile(join(__dirname, 'views/sofort.html')),
)

app.get('/p24', (req, res) => res.sendFile(join(__dirname, 'views/p24.html')))
app.get('/eps', (req, res) => res.sendFile(join(__dirname, 'views/eps.html')))
app.get('/mybank', (req, res) =>
  res.sendFile(join(__dirname, 'views/mybank.html')),
)
app.get('/trustly', (req, res) =>
  res.sendFile(join(__dirname, 'views/trustly.html')),
)

app.get('/giropay', (req, res) =>
  res.sendFile(join(__dirname, 'views/giropay.html')),
)
app.get('/bancontact', (req, res) =>
  res.sendFile(join(__dirname, 'views/bancontact.html')),
)
app.get('/blik', (req, res) => res.sendFile(join(__dirname, 'views/blik.html')))

app.get('/verkkopankki', (req, res) =>
  res.sendFile(join(__dirname, 'views/verkkopankki.html')),
)

app.listen(8080)

if (openBrowser('http://localhost:8080')) {
  console.log('The browser tab has been opened!')
}
