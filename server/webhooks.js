export function webhook(req, res, next) {
  try {
    console.log(
      'INCOMING PAYPAL WEBHOOK...\n%s',
      JSON.stringify(req.body, null, 2),
    )

    const WEBHOOK_EVENT_TYPE = req.body.event_type
    console.log({ WEBHOOK_EVENT_TYPE })
    res.json({ WEBHOOK_EVENT_TYPE })
  } catch (err) {
    console.error(err)
  }
}
