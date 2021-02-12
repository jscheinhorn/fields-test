/* eslint-disable no-nested-ternary */
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const _ = require('lodash')

const { getAuthToken } = require('./oauth')

dotenv.config()

// Used for making API calls to subscribe to and verify webhooks
const PROD = 'https://api.paypal.com'
const SANDBOX = 'https://api.sandbox.paypal.com'
const STAGE = `https://api.heroku.stage.paypal.com`

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? PROD
    : process.env.NODE_ENV === 'sandbox'
    ? SANDBOX
    : STAGE

let hooks = {}

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

/**
 * Verifies a webhook using its provided headers, id, and event (body of req).
 * Returns true if it is successfully verified, else false.
 * https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
 * NOTE: this will always fail with webhooks sent by the simulator: https://developer.paypal.com/developer/webhooksSimulator/
 */
const verifyWebhook = async (req, res, next) => {
  const url = SERVER_URL + req.originalUrl
  const reqHeaders = req.headers

  console.log('Verifying Webhook')
  // Verify the request.
  // NOTE: this will always fail with webhooks sent by the simulator: https://developer.paypal.com/developer/webhooksSimulator/ so if using the simulator, remove this line.

  const { access_token } = await getAuthToken()

  const id = hooks[url]
  const body = {
    transmission_id: reqHeaders['paypal-transmission-id'],
    transmission_time: reqHeaders['paypal-transmission-time'],
    cert_url: reqHeaders['paypal-cert-url'],
    auth_algo: reqHeaders['paypal-auth-algo'],
    transmission_sig: reqHeaders['paypal-transmission-sig'],
    webhook_id: id,
    webhook_event: req.body, // The body of the received webhook
  }
  const response = await fetch(
    `${BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
      method: 'POST',
    },
  ).then(response2 => response2.json())
  const verified = response.verification_status === 'SUCCESS'

  if (!verified) {
    console.log('Webhook could not be verified.')
    res.status(422).end()
  }
  next()
}

/**
 * Uses a capture order link (most easily received from a CHECKOUT.ORDER.APPROVED webhook) to capture payment for an order that has been buyer approved.
 */
const captureOrder = async link => {
  const { access_token } = await getAuthToken()
  console.log({ access_token })
  const res = await fetch(link, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    method: 'POST',
  }).then(response => response.json())
  return res
}

/**
 * Handles the response to the CHECKOUT.ORDER.APPROVED webhook for capturing a payment.
 * This webhook will be fired when an order is verified by the buyer and payment provider, and
 * upon receiving it, the merchant must capture the payment to actually receive it.
 * This function should be assigned to an endpoint which is then subscribed to the CHECKOUT.ORDER.APPROVED webhook (see server.js).
 */
const orderApproved = async (req, res) => {
  // Respond to the PayPal API that the request was received.
  res.status(200).end()

  const links = req.body.resource.links
  console.log('Attempting Order Capture')
  console.log({ links })
  // Search for the capture link in the request.
  const captureLink = _.find(links, link => link.method === 'POST').href

  // If a capture link was given, use it to capture the order.
  if (captureLink !== '') {
    console.log('Capturing Order:', captureLink)
    res = await captureOrder(captureLink)
    console.log('Order capture complete:', res)
  } else {
    console.log('No capture link found in request.')
  }
}

/**
 * Gets the webhook ID associated with the given url, or null if the webhook does not exist.
 */
const getHookID = async url => {
  try {
    const { access_token } = await getAuthToken()
    // Gets all assigned webhooks for this account: https://developer.paypal.com/docs/api/webhooks/v1/#webhooks_list
    const res = await fetch(BASE_URL + '/v1/notifications/webhooks', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      method: 'GET',
    }).then(response => response.json())
    hooks = res.webhooks
    if (hooks) {
      //Iterate through hooks to look for one matching the given URL
      return _.find(hooks, hook => hook.url === url).id
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

/**
 * Subscribes url as a webhook listener to the event names listed in events.
 * If the hook already exists, will update it to listen for the provided events.
 */
const subscribeToHook = async (url, events) => {
  try {
    console.log(`Subscribing ${url} to ${events}`)

    // Build the event_types array as objects in format {name: event}
    let event_types = _.map(events, event => {
      return { name: event }
    })

    // Get the hook ID to update, or null this hook does not yet exist.
    let hookID = await getHookID(url)

    const { access_token } = await getAuthToken()

    if (hookID) {
      // The webhook for this URL already exists, so update it with a patch object. See: https://developer.paypal.com/docs/api/webhooks/v1/#definition-patch
      const body = [
        {
          op: 'replace',
          path: '/event_types',
          value: event_types,
        },
      ]
      const res = await fetch(
        `${BASE_URL}/v1/notifications/webhooks/${hookID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(body),
          method: 'PATCH',
        },
      ).then(response => response.json())

      console.log(
        'Patched existing webhook. Result of update:',
        res,
        'for webhook id',
        hookID,
        'subscribed to',
        url,
      )
    } else {
      // The webhook for this URL does not exist, so create it. See: https://developer.paypal.com/docs/api/webhooks/v1/#webhooks_post
      const body = {
        url,
        event_types,
      }
      const response = await fetch(`${BASE_URL}/v1/notifications/webhooks`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body),
        method: 'POST',
      }).then(res => res.json())
      if (!response.name || response.name.includes('ERROR')) {
        hooks[url] = null
        console.error('ERROR:', response)
      }
      console.log('Created Webhook:', response)
      hookID = response.id
    }

    // Store the webhook's ID for verification later.
    hooks[url] = hookID
  } catch (err) {
    console.log(err)
  }
}

/**
 * Grab a token and subscribe the webhook.
 */
const setupWebhooks = async () => {
  subscribeToHook(SERVER_URL + '/webhook', ['CHECKOUT.ORDER.APPROVED'])
}

module.exports = {
  verifyWebhook,
  orderApproved,
  setupWebhooks,
}
