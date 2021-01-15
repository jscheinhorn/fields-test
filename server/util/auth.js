import { getAuthUrl } from '../apiconfig'
import https from 'https'
import axios from 'axios'

// Auth Token Request
export default async function postGetAuthToken(environment) {
  console.log({ environment })
  const authUrl = getAuthUrl(environment)
  console.log({ authUrl })
  let secret, clientId, basicAuth
  switch (environment) {
    case 'live':
      clientId = process.env.PP_LIVE_CLIENT_ID_WEBHOOK
      secret = process.env.PP_LIVE_CLIENT_SECRET_WEBHOOK
      basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64')
      break
    case 'sandbox':
      clientId = process.env.PP_SANDBOX_CLIENT_ID_WEBHOOK
      secret = process.env.PP_SANDBOX_CLIENT_SECRET_WEBHOOK
      basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64')
      break
    default:
      basicAuth = process.env.PP_STAGE_MERCH_AUTH_CODE
      break
  }
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
    return response.data.access_token
  } catch (err) {
    console.error(err)
    return err
  }
}
