/* eslint-disable no-nested-ternary */
const dotenv = require('dotenv')
const btoa = require('btoa')
const fetch = require('node-fetch')

dotenv.config()

// const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
// const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const MERCHANT_AUTH_CODE = process.env.PP_STAGE_MERCH_AUTH_CODE

// const PROD = "https://api.paypal.com";
// const SANDBOX = "https://api.sandbox.paypal.com";
const STAGE = `https://api.msmaster.qa.paypal.com`

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? PROD
    : process.env.NODE_ENV === 'sandbox'
    ? SANDBOX
    : STAGE

// Get an OAuth token for the PayPal Orders API using the credentials included in the .env file.
// https://developer.paypal.com/docs/api/get-an-access-token-curl/
async function getAuthToken() {
  // const bearer = `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`

  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    body: 'grant_type=client_credentials',
    headers: {
      //   Accept: "application/json",
      //   Authorization: `Basic ${btoa(bearer)}`,
      Authorization: `Basic ${MERCHANT_AUTH_CODE}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  const { access_token } = await response.json()

  return { access_token }
}

module.exports = {
  getAuthToken,
}
