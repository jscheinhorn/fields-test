import { getRequestUrl, getAuthUrl } from './apiconfig'
import fetch from 'node-fetch'
// import btoa from 'btoa'
import https from 'https'
import servicecore from 'servicecore'

// Auth Token Request
export async function postGetAuthToken(req, res) {
  const { live, sandbox, 'client-id': clientId } = req.query
  console.log({ live, sandbox, clientId }, req.query)
  const { stage } = req.body
  console.log('**** ** req.body ** ****', req.body)
  const authUrl = getAuthUrl({ live, sandbox, stage })
  console.log({ authUrl, clientId })
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

  // USING FETCH
  const response = await fetch(authUrl, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Accept-Language': 'en_US',
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  console.log({ response })
  return response
  //   resSendGenericResponse(res, response)
}

// Create Order Request
export async function createPaymentHandler(req, res) {
  const queryParams = req.query
  const stage = queryParams.stage || 'msmaster'
  const {
    total,
    currency,
    locale,
    email,
    thirdParty,
    shippingPreference,
    live,
    sandbox,
    prefilledShippingAddress,
    prefilledCartDetails,
    noexecute,
  } = queryParams
  const originHostUrl = `${req.protocol}://${req.get('host')}`

  const countryCode = locale.slice(-2)

  const requestUrl = getRequestUrl({ live, sandbox, stage })
  //   const cred = getDefaultCred({ live, sandbox })
  let returnUrl = `${originHostUrl}${req.originalUrl}` // using here? or already w/i application context
  //   const cancelUrl = `${originHostUrl}/api/cancel` // not used here
  console.log({ returnUrl })

  const payload = mapToCreatePayment({
    amount,
    items,
    shippingPreference,
    payerInfo: { email },
    shippingAddress: prefilledShippingAddress && addresses[countryCode],
    thirdPartyMerchantEmail,
    returnUrl,
    cancelUrl,
  })

  const response = await sendRequest({
    method: 'POST',
    url: requestUrl,
    data: payload,
    headers: {
      'X-PAYPAL-SECURITY-CONTEXT': securityContext,
      'Content-Type': 'application/json',
    },
  })

  resSendResponse(res, response)
}

// Helper Functions
export function resSendError(res, serviceResponse) {
  resSetCorrelationId(res, serviceResponse)
  res.status(serviceResponse.status).send(serviceResponse.data)
}

export function resSendResponse(res, serviceResponse, mapFrom) {
  if (serviceResponse.status === 200 || serviceResponse.status === 201) {
    resSetCorrelationId(res, serviceResponse)
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
