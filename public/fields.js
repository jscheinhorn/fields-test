/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */
import configureSdk from './configureSdk.js'
import apmRender from './apmRender.js'
// import * as swal from 'sweetalert' // This will be for the popup after onApprove,
// sweetalert has an issue with typescript (needs Swal type specified) and needs:
// npm install --save @types/sweetalert

const urlParams = new URLSearchParams(window.location.search)
const clientId = urlParams.get('client-id')
let environment = urlParams.get('environment')
const testEnv = urlParams.get('test-env')
const otherTe = urlParams.get('other-test-env')
console.log({ environment, testEnv, otherTe })
if (environment === 'stage') {
  if (testEnv === 'other') {
    environment = otherTe
  } else {
    environment = testEnv
  }
}
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

const order = {
  intent: 'CAPTURE',
  purchase_units: [
    {
      amount: {
        currency_code: 'EUR',
        value: '49.11',
      },
    },
  ],
  application_context: {
    return_url: `${window.location.origin}/success.html`,
    cancel_url: `${window.location.origin}/cancel.html`,
  },
}

let apm = {
  ideal: 0,
  eps: 0,
  blik: 0,
  bancontact: 0,
  giropay: 0,
  mybank: 0,
  p24: 0,
  trustly: 0,
  verkkopankki: 0,
  sofort: 0,
}
for (let keyValuePair of urlParams) {
  if (keyValuePair[0] in apm) {
    apm[keyValuePair[0]] = 1
  }
}
console.log({ apm })

const src = configureSdk(clientId, environment)
let script = document.createElement('SCRIPT')
script.src = src
// script.onload = idealRender // TODO: Try importing this and providing APM as argument
script.onload = function() {
  apmRender(apm, style, order)
}
document.head.appendChild(script)

// function idealRender() {
//   console.log('PayPal SDK version:', paypal.version)

//   /* -----
// PAYPAL
// ------ */
//   paypal
//     .Marks({
//       fundingSource: paypal.FUNDING.PAYPAL,
//     })
//     .render('#paypal-mark')

//   paypal
//     .Buttons({
//       fundingSource: paypal.FUNDING.PAYPAL,

//       style: {
//         label: 'pay',
//       },

//       createOrder(data, actions) {
//         return actions.order.create(order)
//       },

//       onApprove(data, actions) {
//         return actions.order.capture().then(function(details) {
//           console.log({ details })
//           alert(`Transaction completed by ${details.payer.name.given_name}!`)
//         })
//       },
//     })
//     .render('#paypal-btn')

//   /* -----
// IDEAL
// ------ */
// // TODO: FOR EACH MARK, FIELD, and BUTTON
// // dynamically make each APM container with its id
//   paypal
//     .Marks({
//       fundingSource: paypal.FUNDING.IDEAL,
//     })
//     .render('#ideal-mark')
//     // TODO: dynamically make each APM container with its id

//   paypal
//     .Fields({
//       fundingSource: paypal.FUNDING.IDEAL,
//       style,
//       fields: {
//         name: {
//           value: name,
//           hidden: false,
//         },
//         email: {
//           value: name,
//           hidden: false,
//         },
//       },
//     })
//     .render('#ideal-container')
//     // TODO: dynamically make each APM container with its id

//   paypal
//     .Buttons({
//       fundingSource: paypal.FUNDING.IDEAL,

//       style: {
//         label: 'pay',
//       },

//       async createOrder(data, actions) {
//         // TODO: ensure createPaymentUrl still working with changes
//         // let environment= urlParams.get('environment')
//         if (urlParams.get('pre-fill') === '1') {
//           let [prefix, queryParams] = src.split('?')
//           console.log({ queryParams })
//           if (environment=== 'sandbox') {
//             queryParams += '&sandbox=1'
//           } else if (environment=== 'live') {
//             queryParams += '&live=1'
//           }
//           let authUrl = '/api/getauthtoken?' + queryParams
//           let createPaymentUrl = '/api/createpayment?' + queryParams
//           console.log({ environment})
//           let accessToken = 'undefined'

//           try {
//             const authResponse = await fetch(authUrl, {
//               method: 'post',
//               headers: {
//                 'content-type': 'application/json',
//               },
//               body: JSON.stringify({ stage: environment}),
//             })
//             const authResponseJson = await authResponse.json()
//             console.log({ authResponseJson })
//             accessToken = authResponseJson.access_token
//             console.log('accessToken: ' + accessToken)
//           } catch (error) {
//             console.error(error)
//           }

//           return fetch(createPaymentUrl, {
//             method: 'post',
//             headers: {
//               'content-type': 'application/json',
//             },
//             body: JSON.stringify({ stage: envi, order, accessToken }),
//           })
//             .then(res => res.json())
//             .then(createOrderData => {
//               console.log({ createOrderData })
//               return createOrderData.id
//             })
//         }
//         return actions.order.create(order).then(createdOrderReturn => {
//           console.log({ createdOrderReturn })
//           return createdOrderReturn
//         })
//       },

//       onApprove(data, actions) {
//         // Currently not being called. Aditya is working on it.
//         console.log({ data, actions })
//         return actions.order.capture().then(capturedata => {
//           const capturedataString = JSON.stringify(capturedata, null, 2)
//           console.log(capturedataString)
//           alert(capturedataString)
//         })
//       },
//     })
//     .render('#ideal-btn')
//     // TODO: dynamically make each APM container with its id

//   /* -----
// SOFORT
// ------ */
//   paypal
//     .Marks({
//       fundingSource: paypal.FUNDING.SOFORT,
//     })
//     .render('#sofort-mark')

//   paypal
//     .Fields({
//       fundingSource: paypal.FUNDING.SOFORT,
//       style,
//       fields: {
//         name: {
//           value: name,
//           hidden: false,
//         },
//       },
//     })
//     .render('#sofort-container')

//   paypal
//     .Buttons({
//       fundingSource: paypal.FUNDING.SOFORT,

//       style: {
//         label: 'pay',
//       },

//       createOrder(data, actions) {
//         return actions.order.create(order)
//       },

//       onApprove(data, actions) {
//         return actions.order.capture().then(function(details) {
//           alert(`Transaction completed by ${details.payer.name.given_name}!`)
//         })
//       },
//     })
//     .render('#sofort-btn')
// }

// /* -----
// RADIO BUTTONS
// ------ */
// // Listen for changes to the radio buttons
// document.querySelectorAll('input[name=payment-option]').forEach(el => {
//   // handle button toggles
//   el.addEventListener('change', event => {
//     switch (event.target.value) {
//       case 'paypal':
//         document.body.querySelector('#ideal-container').style.display = 'none'
//         document.getElementById('ideal-btn').style.display = 'none'

//         document.body.querySelector('#sofort-container').style.display = 'none'
//         document.body.querySelector('#paypal-btn').style.display = 'block'

//         document.getElementById('sofort-btn').style.display = 'none'

//         break
//       case 'ideal':
//         document.body.querySelector('#ideal-container').style.display = 'block'
//         document.getElementById('ideal-btn').style.display = 'block'

//         document.body.querySelector('#sofort-container').style.display = 'none'
//         document.body.querySelector('#paypal-btn').style.display = 'none'

//         document.getElementById('sofort-btn').style.display = 'none'
//         break

//       case 'sofort':
//         document.body.querySelector('#ideal-container').style.display = 'none'
//         document.getElementById('ideal-btn').style.display = 'none'

//         document.body.querySelector('#paypal-btn').style.display = 'none'

//         document.body.querySelector('#sofort-container').style.display = 'block'
//         document.getElementById('sofort-btn').style.display = 'block'
//         break
//       default:
//         break
//     }
//   })
// })

// document.body.querySelector('#ideal-container').style.display = 'none'
// document.getElementById('ideal-btn').style.display = 'none'

// document.body.querySelector('#sofort-container').style.display = 'none'
// document.getElementById('sofort-btn').style.display = 'none'
