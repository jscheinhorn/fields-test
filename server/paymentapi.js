import { createOrderUrl, getAuthUrl } from './apiconfig'
import fetch from 'node-fetch'
import axios from 'axios'
// import btoa from 'btoa'
import https from 'https'
import { access } from 'fs'
// import servicecore from 'servicecore'

// Auth Token Request
export async function postGetAuthToken(req, res) {
  const { live, sandbox, 'client-id': clientId } = req.query
  const { stage } = req.body
  const authUrl = getAuthUrl({ live, sandbox, stage })

  console.log(authUrl)
  const basicAuth = Buffer.from(clientId).toString('base64')
  const agentOptions = {
    rejectUnauthorized: false,
    host: '127.0.0.1',
    port: '9000',
    path: '/systemproxy-1603902803.pac',
  }
  const httpsAgent = new https.Agent(agentOptions)

  // // ADDED TO USE SERVICECORE IN LIEU OF FETCH:
  // (CANNOT USE SERVICECORE ON HEROKU)
  // const client = servicecore.create('identitysecuretokenserv', {
  //   transport: 'ppaas',
  // })
  // const hostAndPort = authUrl.split('/')[2].split(':')
  // const hostname = hostAndPort[0]
  // const port = hostAndPort[1]
  // console.log({ hostname, port })
  // const { body } = await client.request(req, {
  //   method: 'POST',
  //   hostname,
  //   port,
  //   path: `/v1/oauth2/token`,
  //   headers: {
  //     'Content-type': 'application/x-www-form-urlencoded',
  //     Authorization: `Basic ${basicAuth}`,
  //   },
  //   body: 'grant_type=client_credentials',
  // })

  // USING AXIOS (getAuthToken)
  const method = 'post'
  const data = 'grant_type=client_credentials'
  const url = authUrl
  const headers = {
    'Content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${basicAuth}`,
  }
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
      httpsAgent,
    })
    res.status(response.status).json(response.data)
  } catch (err) {
    console.error(err)
    res.send(500)
  }

  // USING FETCH
  // try {
  //   const response = await fetch(authUrl, {
  //     method: 'POST',
  //     body: 'grant_type=client_credentials',
  //     headers: {
  //       'Accept-Language': 'en_US',
  //       Authorization: `Basic ${basicAuth}`,
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //   })
  //   const json = await response.json()
  //   res.status(response.status).json(json)
  // } catch (err) {
  //   console.error(err)
  //   res.send(500)
  // }

  //   resSendGenericResponse(res, response)
}

// Create Order Request
export async function createPaymentHandler(req, res) {
  const { live, sandbox } = req.query
  const { order, stage, accessToken } = req.body
  const agentOptions = {
    rejectUnauthorized: false,
    host: '127.0.0.1',
    port: '9000',
    path: '/systemproxy-1603902803.pac',
  }
  const httpsAgent = new https.Agent(agentOptions)
  // console.log({order, stage, accessToken})
  // const stage = queryParams.stage || 'msmaster'
  // const {
  //   total,
  //   currency,
  //   locale,
  //   email,
  //   thirdParty,
  //   shippingPreference,
  //   live,
  //   sandbox,
  //   prefilledShippingAddress,
  //   prefilledCartDetails,
  //   noexecute,
  // } = queryParams
  const originHostUrl = `${req.protocol}://${req.get('host')}`

  // const countryCode = locale.slice(-2)

  const requestUrl = createOrderUrl({ live, sandbox, stage })
  //   const cred = getDefaultCred({ live, sandbox })
  // let returnUrl = `${originHostUrl}${req.originalUrl}` // using here? or already w/i application context
  //   const cancelUrl = `${originHostUrl}/api/cancel` // not used here
  // console.log({ requestUrl })

  // const payload = mapToCreatePayment({
  //   amount,
  //   items,
  //   shippingPreference,
  //   payerInfo: { email },
  //   shippingAddress: prefilledShippingAddress && addresses[countryCode],
  //   thirdPartyMerchantEmail,
  //   returnUrl,
  //   cancelUrl,
  // })

  // // USING FETCH
  // const response = await fetch(requestUrl, {
  //   method: 'POST',
  //   body: JSON.stringify(order),
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json',
  //   },
  // })
  // const json = await response.json()
  // console.log({ json })
  // res.send(json)
  // resSendResponse(res, response)

  // USING AXIOS (createOrder)
  const method = 'post'
  const data = order
  const url = requestUrl
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }

  try {
    const createOrderResponse = await axios({
      method,
      url,
      data,
      headers,
      httpsAgent,
    })
    res.status(createOrderResponse.status).json(createOrderResponse.data)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
}

// Helper Functions
export function resSendError(res, serviceResponse) {
  // resSetCorrelationId(res, serviceResponse)
  res.status(serviceResponse.status).send(serviceResponse.data)
}

export function resSendResponse(res, serviceResponse, mapFrom) {
  if (serviceResponse.status === 200 || serviceResponse.status === 201) {
    // resSetCorrelationId(res, serviceResponse)
    res.send(mapFrom(serviceResponse.data))
  } else {
    resSendError(res, serviceResponse)
  }
}

// TODO: MODIFY FOR AXIOS AND REFACTOR AUTH AND CREATEORDER FUNCTIONS
export async function sendRequest({ method, url, headers, data, retries }) {
  const hastries = retries || 1
  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    })
    const response = await fetch({
      method,
      url,
      data,
      headers,
      httpsAgent,
    })
    // console.log(`sendRequest response=${response}`);

    if (response.status === 200 || response.status === 201 || hastries > 2) {
      return response
    }
  } catch (err) {
    // console.log(err);
    const response = err.response || {}
    // console.log(`sendRequest response=${response}`);
    if (hastries > 2) {
      return {
        status: response.status || 500,
        data: response.data || 'Exception',
      }
    }
  }

  console.log('sendRequest retries')

  return sendRequest({
    method,
    url,
    headers,
    data,
    retries: hastries + 1,
  })
}

export default {
  sendRequest,
}
