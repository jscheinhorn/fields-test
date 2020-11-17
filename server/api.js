/* eslint-disable new-cap */
const paymentapi = require('./paymentapi')
const configinfo = require('./configinfo')
const { catchErrors } = require('./errors')
const Router = require('express')

const router = Router()

router.post('/getauthtoken', catchErrors(paymentapi.postGetAuthToken))
router.post('/createpayment', catchErrors(paymentapi.createPaymentHandler))
router.post('/clientid', catchErrors(configinfo.merchantClientId))

router.use('*', function(req, res, next) {
  console.log('PROBLEM')
})

module.exports = router
