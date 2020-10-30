import { createOrderUrl, getAuthUrl } from './apiconfig'
import axios from 'axios'
import https from 'https'

// Auth Token Request
export async function postGetAuthToken(req, res) {
  const { live, sandbox, 'client-id': clientId } = req.query
  const { stage } = req.body
  const authUrl = getAuthUrl({ live, sandbox, stage })
  console.log({ authUrl })
  const basicAuth = Buffer.from(clientId).toString('base64')
  const agentOptions = {
    rejectUnauthorized: false,
    keepAlive: true,
  }
  const requestOptions = {
    method: 'post',
    data: 'grant_type=client_credentials',
    url: authUrl,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    httpsAgent: new https.Agent(agentOptions),
  }

  try {
    const response = await axios(requestOptions)
    res.status(response.status).json(response.data)
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
  const orderUrl = createOrderUrl({ live, sandbox, stage })
  console.log({ orderUrl })
  const agentOptions = {
    rejectUnauthorized: false,
    keepAlive: true,
  }
  const requestOptions = {
    method: 'post',
    data: order,
    url: orderUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: new https.Agent(agentOptions),
  }

  try {
    const createOrderResponse = await axios(requestOptions)
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

// TODO: Refactor postGetAuthToken and createPaymentHandler to use sendRequest, otherwise delete this.
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
