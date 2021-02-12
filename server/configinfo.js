// Used to get Client ID based on Environment dropdown selection
// api/clientid
export async function merchantClientId(req, res) {
  let clientId
  const { environment } = req.body
  switch (environment) {
    case 'sandbox':
      clientId = process.env.PP_SANDBOX_CLIENT_ID_WEBHOOK
      break
    case 'live':
      clientId = process.env.PP_LIVE_CLIENT_ID_WEBHOOK
      break
    default:
      clientId = process.env.PP_STAGE_CLIENT_ID
      break
  }
  res.status(200).json(clientId)
}

// TODO: Delete? Not used
export async function merchantSecret(req, res) {
  let clientId
  const { environment } = req.body
  switch (environment) {
    case 'sandbox':
      clientSecret = process.env.PP_SANDBOX_CLIENT_SECRET_WEBHOOK
      break
    case 'live':
      clientSecret = process.env.PP_LIVE_CLIENT_SECRET_WEBHOOK
      break
    default:
      clientSecret = process.env.PP_STAGE_CLIENT_ID // TODO: need this? Using PP_STAGE_MERCH_AUTH_CODE env variable
      break
  }
  res.status(200).json(clientSecret)
}
