/* eslint-disable no-nested-ternary */
const url = require('url')
const fetch = require('node-fetch')
const axios = require('axios')
const HttpsProxyAgent = require('https-proxy-agent');
const {getPayPalApi} = require('./ppapi')
require('dotenv').config()

// Can do either axios or fetch?, 
// calls to api.heroku.paypal aren't working b/c it only allows from ... quotaguard? 
// but this app is using the proxy?
console.log('static url', process.env.QUOTAGUARDSTATIC_URL)
const proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);
const axiosProxy = {
  host: proxy.host,
  port: proxy.port,
  auth: proxy.auth
}

const agent = new HttpsProxyAgent(proxy);

// let {BASE_URL, bearer} = getPayPalApi();

// const axiosRequestOptions = {
//   method: 'post',
//   url: `${BASE_URL}/v1/oauth2/token`,
//   headers: {
//     'Content-type': 'application/x-www-form-urlencoded',
//     Authorization: `Basic ${bearer}`,
//   },
//   data: 'grant_type=client_credentials',
//   httpsAgent: agent,
//   proxy: axiosProxy
// }

// Get an OAuth token for the PayPal Orders API using the credentials included in the .env file.
// https://developer.paypal.com/docs/api/get-an-access-token-curl/

async function getAuthToken() {
  console.log(process.env.NODE_ENV, { BASE_URL })
  let {BASE_URL, bearer} = getPayPalApi();
  console.log(process.env.NODE_ENV, { BASE_URL })
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    // agent,
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${bearer}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
 
  const {access_token} = await response.json()

  // console.log('*** Making axios request for auth token: ***')
  // const { data } = await axios(axiosRequestOptions)
  // const { access_token } = data

  return { access_token }
}

module.exports = {
  getAuthToken,
}
