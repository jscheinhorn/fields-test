import { postGetAuthToken } from './paymentapi'

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

// Need to specify selected Environment from front-end
const PROD = 'https://api.paypal.com'
const SANDBOX = 'https://api.sandbox.paypal.com'
const STAGE = `https://api.msmaster.qa.paypal.com`
const BASE_URL = process.env.NODE_ENV === 'production' ? PROD : SANDBOX

const captureOrder = async link => {
  const { access_token } = await getAuthToken()
  const res = await fetch(link, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    method: 'POST',
  }).then(response => response.json())
  return res
}

const orderApproved = async (req, res) => {
  // Respond to the PayPal API that the request was received.
  res.status(200).end()

  const links = req.body.resource.links
  console.log('Attempting Order Capture')
  // Search for the capture link in the request.
  const captureLink = _.find(links, link => link.rel === 'capture').href
  // NOTE: In the sample response from the API the capture link does not have a rel attribute...

  // if (!captureLink) {

  // }

  // If a capture link was given, use it to capture the order.
  if (captureLink !== '') {
    console.log('Capturing Order:', captureLink)
    res = await captureOrder(captureLink)
    console.log('Order capture complete:', res)
  } else {
    console.log('No capture link found in request.')
  }
}
