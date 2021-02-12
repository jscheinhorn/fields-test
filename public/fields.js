/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */
import configureSdk from './configureSdk.js'
import apmRender from './apmRender.js'

const urlParams = new URLSearchParams(window.location.search)
const clientId = urlParams.get('client-id') // Necessary? Used for SDK script, but stage MERCHANT_AUTH_CODE hard-coded from env
let environment = urlParams.get('environment')
const testEnv = urlParams.get('test-env')
const otherTe = urlParams.get('other-test-env')
console.log({ environment, testEnv, otherTe })

// Specify stage name
if (environment === 'stage') {
  if (testEnv === 'other') {
    environment = otherTe
  } else {
    environment = testEnv
  }
}

// Make call to server to change process.env.NODE_ENV and TEST_ENV when user selects new environment
console.log({ environment })

let name = ''
if (urlParams.get('pre-fill') === '1') {
  name = 'John Smith'
}
console.log({ name })

const style = {
  base: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: '16px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    lineHeight: '1.4',
    letterSpacing: '0.3',
  },
  input: {
    backgroundColor: 'white',
    fontSize: '16px',
    color: '#333',
    borderColor: '#dbdbdb',
    borderRadius: '4px',
    borderWidth: '1px',
    padding: '1rem',
  },
  invalid: {
    color: 'red',
  },
  active: {
    color: 'black',
  },
}

let order = {
  intent: 'CAPTURE',
  purchase_units: [
    {
      amount: {
        currency_code: 'EUR',
        value: '1.00',
      },
    },
  ],
  application_context: {
    return_url: `${window.location.origin}/success.html`,
    cancel_url: `${window.location.origin}/cancel.html`,
  },
}

// Change amount value from default
if (urlParams.get('amount')) {
  order.purchase_units[0].amount.value = urlParams.get('amount')
  console.log('order amount: ', order.purchase_units[0].amount.value)
}

let currency = urlParams.get('currency')
  ? urlParams.get('currency').toUpperCase()
  : 'EUR'

// Change currency value from default
if (currency) {
  order.purchase_units[0].amount.currency_code = currency
  console.log('currency code: ', order.purchase_units[0].amount.currency_code)
}

// Used in testing. Locale is used in live.
let buyerCountry = urlParams.get('country').toUpperCase()

let apm = {
  ideal: 0,
  eps: 0,
  blik: 0,
  bancontact: 0,
  giropay: 0,
  mybank: 0,
  p24: 0,
  trustly: 0,
  sofort: 0,
}
for (let keyValuePair of urlParams) {
  if (keyValuePair[0] in apm) {
    apm[keyValuePair[0]] = 1
  }
}
console.log({ apm })

// Configure the PayPal JavaScript SDK
const src = configureSdk(clientId, environment, apm, buyerCountry, currency)
let script = document.createElement('SCRIPT')
script.src = src

// Function to render the selected APMs
script.onload = function() {
  apmRender(apm, style, order, environment, name)
}
document.head.appendChild(script)
