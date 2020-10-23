import { createOrderUrl, getAuthUrl } from './apiconfig'
import fetch from 'node-fetch'
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

  // // ADDED TO USE SERVICECORE IN LIEU OF FETCH:
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

  // USING FETCH (CANNOT USE SERVICECORE ON HEROKU)
  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        'Accept-Language': 'en_US',
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const json = await response.json()
    res.status(response.status).json(json)
  } catch (err) {
    console.error(err)
    res.send(500)
  }

  //   resSendGenericResponse(res, response)
}

// Create Order Request
export async function createPaymentHandler(req, res) {
  const { live, sandbox } = req.query
  const { order, stage, accessToken } = req.body
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
  // You Were about to go ahead and make sure the order, auth token, and stage are being sent down here
  const response = await fetch(requestUrl, {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  const json = await response.json()
  console.log({ json })
  res.send(json)
  // resSendResponse(res, response)
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
