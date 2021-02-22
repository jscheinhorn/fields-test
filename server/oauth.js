/* eslint-disable no-nested-ternary */
const dotenv = require('dotenv')
const btoa = require('btoa')
// const fetch = require('node-fetch')
const axios = require('axios')
const HttpsProxyAgent = require('https-proxy-agent');

const proxy = process.env.QUOTAGUARDSTATIC_URL;
const agent = new HttpsProxyAgent(proxy);
console.log({agent})

dotenv.config()

let bearer
let PAYPAL_CLIENT_ID
let PAYPAL_CLIENT_SECRET
const MERCHANT_AUTH_CODE = process.env.PP_STAGE_MERCH_AUTH_CODE

let BASE_URL
const PROD = 'https://api.paypal.com'
const SANDBOX = 'https://api.sandbox.paypal.com'
const STAGE = `https://api.${process.env.TEST_ENV}.stage.paypal.com`

switch (process.env.NODE_ENV) {
  case 'live':
    BASE_URL = PROD
    PAYPAL_CLIENT_ID = process.env.PP_LIVE_CLIENT_ID_WEBHOOK
    PAYPAL_CLIENT_SECRET = process.env.PP_LIVE_CLIENT_SECRET_WEBHOOK
    bearer = `${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
    break
  case 'sandbox':
    BASE_URL = SANDBOX
    PAYPAL_CLIENT_ID = process.env.PP_SANDBOX_CLIENT_ID_WEBHOOK
    PAYPAL_CLIENT_SECRET = process.env.PP_SANDBOX_CLIENT_SECRET_WEBHOOK
    bearer = `${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
    break
  default:
    BASE_URL = STAGE
    bearer = MERCHANT_AUTH_CODE
    break
}

const requestOptions = {
  method: 'post',
  url: `${BASE_URL}/v1/oauth2/token`,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${bearer}`,
  },
  data: 'grant_type=client_credentials',
  httpsAgent: agent,
}

// Get an OAuth token for the PayPal Orders API using the credentials included in the .env file.
// https://developer.paypal.com/docs/api/get-an-access-token-curl/
async function getAuthToken() {
  console.log({ BASE_URL })
  // const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
  //   agent,
  //   body: 'grant_type=client_credentials',
  //   headers: {
  //     Authorization: `Basic ${bearer}`,
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   method: 'POST',
  // })
  console.log('*** Making axios request for auth token: ***')
  const { data } = await axios(requestOptions)
  const { access_token } = data

  return { access_token }
}

module.exports = {
  getAuthToken,
}
