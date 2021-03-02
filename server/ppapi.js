require('dotenv').config()

export function getPayPalApi() {
    let bearer
    let PAYPAL_CLIENT_ID
    let PAYPAL_CLIENT_SECRET
    const MERCHANT_AUTH_CODE = process.env.PP_STAGE_MERCH_AUTH_CODE

    let BASE_URL
    const PROD = 'https://api.paypal.com'
    const SANDBOX = 'https://api.sandbox.paypal.com'
    const STAGE = `https://api.${process.env.TEST_ENV}.qa.paypal.com`
    const PARTNER_STAGE = `https://api.heroku.stage.paypal.com`

    switch (process.env.NODE_ENV) {
    case 'live':
        BASE_URL = PROD
        PAYPAL_CLIENT_ID = process.env.PP_LIVE_CLIENT_ID_WEBHOOK
        PAYPAL_CLIENT_SECRET = process.env.PP_LIVE_CLIENT_SECRET_WEBHOOK
        bearer = `${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
        break
    case 'sandbox':
        BASE_URL = SANDBOX
        PAYPAL_CLIENT_ID = process.env.PP_SANDBOX_CLIENT_ID_WEBHOOK
        PAYPAL_CLIENT_SECRET = process.env.PP_SANDBOX_CLIENT_SECRET_WEBHOOK
        bearer = `${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
        break
    case 'partner':
        BASE_URL = PARTNER_STAGE
        bearer = MERCHANT_AUTH_CODE
        break
    default:
        BASE_URL = STAGE
        bearer = MERCHANT_AUTH_CODE
        break
    }
    return {BASE_URL, bearer}
}
