function webhook(req, res, next) {
  console.log(
    'INCOMING PAYPAL WEBHOOK...\n%s',
    JSON.stringify(req.body, null, 2),
  )

  const WEBHOOK_EVENT_TYPE = req.body.event_type
  res.send(WEBHOOK_EVENT_TYPE)
}
