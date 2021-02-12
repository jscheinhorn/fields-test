import { createOrderUrl, getOrderUrl } from './apiconfig'
import { getAuthToken } from './oauth'
import axios from 'axios'
import https from 'https'

// Create Order Request
export async function createOrder(req, res) {
  const { order, environment } = req.body
  const { access_token } = await getAuthToken(environment)
  const orderUrl = getOrderUrl(environment)
  const agentOptions = {
    rejectUnauthorized: false,
    keepAlive: true,
  }
  const requestOptions = {
    method: 'post',
    url: orderUrl,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    data: order,
    httpsAgent: new https.Agent(agentOptions),
  }

  try {
    const response = await axios(requestOptions)
    res.status(response.status).json(response.data)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
}

// Get Order Request
export async function getOrder(req, res) {
  const { 'order-id': orderId } = req.query
  const { access_token } = await getAuthToken(req.body.environment)
  const orderUrl = getOrderUrl(req.body.environment) + '/' + orderId
  const agentOptions = {
    rejectUnauthorized: false,
    keepAlive: true,
  }
  const requestOptions = {
    method: 'get',
    url: orderUrl,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${access_token}`,
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
}

// TODO: Delete if not being used. 
// Using webhook to capture orders for Drop-in UI
// Capture order request
export async function captureOrderHandler(req, res) {
  const { order, environment, accessToken } = req.body
  const orderUrl = createOrderUrl(environment) + '/' + order + '/capture'
  console.log({ orderUrl })
  const agentOptions = {
    rejectUnauthorized: false,
    keepAlive: true,
  }
  const requestOptions = {
    method: 'post',
    url: orderUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: new https.Agent(agentOptions),
  }

  try {
    const captureOrderResponse = await axios(requestOptions)
    res.status(captureOrderResponse.status).json(captureOrderResponse.data)
  } catch (err) {
    console.error(err)
    res.send(500)
  }
}
