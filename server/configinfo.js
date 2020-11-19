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
      clientSecret = process.env.PP_STAGE_CLIENT_ID // TODO: need this? currently N/A
      break
  }
  res.status(200).json(clientSecret)
}
