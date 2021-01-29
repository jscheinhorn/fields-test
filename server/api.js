/* eslint-disable new-cap */
const paymentapi = require('./paymentapi')
const configinfo = require('./configinfo')
const webhooks = require('./webhookalt')
const { catchErrors } = require('./errors')
const Router = require('express')

const router = Router()

// Get Auth Token for API Access
router.post('/getauthtoken', catchErrors(paymentapi.postGetAuthToken))

// Create Order
router.post('/createorder', catchErrors(paymentapi.createOrder))

// Get Order
router.post('/getorder', catchErrors(paymentapi.getOrder))

// Capture Order
router.post('/capture', catchErrors(paymentapi.captureOrderHandler))

// TODO: Delete these, not doing server side
// Server Side API Routes to create order/payment
router.post('/createpayment', catchErrors(paymentapi.createPaymentHandler))

router.get('/getorder', catchErrors(paymentapi.createPaymentHandler))

// Environment and Merchant Configurations
router.post('/clientid', catchErrors(configinfo.merchantClientId))

// Webhook URL
router.post('/webhook', catchErrors(webhooks.webhook))

router.use('*', function(req, res, next) {
  console.log('PROBLEM')
})

module.exports = router
