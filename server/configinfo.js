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
