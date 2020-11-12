/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */
import configureSdk from '../configureSdk.js'
// import * as swal from 'sweetalert' // This will be for the popup after onApprove,
// sweetalert has an issue with typescript (needs Swal type specified) and needs:
// npm install --save @types/sweetalert

const src = configureSdk()
let script = document.createElement('SCRIPT')
script.src = src
script.onload = idealRender // TODO: Try importing this and providing APM as argument
document.head.appendChild(script)

const { preFill, serverSide } = sessionStorage
console.log({ preFill, serverSide })
console.log('sessionStorage.environment: ', sessionStorage.environment)

let name = ''
if (preFill === 'true') {
  name = 'John Smith'
}

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

function idealRender() {
  console.log('PayPal SDK version:', paypal.version)

  /* -----
PAYPAL
------ */
  paypal
    .Marks({
      fundingSource: paypal.FUNDING.PAYPAL,
    })
    .render('#paypal-mark')

  paypal
    .Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,

      style: {
        label: 'pay',
      },

      createOrder(data, actions) {
        return actions.order.create(order)
      },

      onApprove(data, actions) {
        return actions.order.capture().then(function(details) {
          console.log({ details })
          alert(`Transaction completed by ${details.payer.name.given_name}!`)
        })
      },
    })
    .render('#paypal-btn')

  /* -----
IDEAL
------ */
  paypal
    .Marks({
      fundingSource: paypal.FUNDING.IDEAL,
    })
    .render('#ideal-mark')

  paypal
    .Fields({
      fundingSource: paypal.FUNDING.IDEAL,
      style,
      fields: {
        name: {
          value: name,
          hidden: false,
        },
        email: {
          value: name,
          hidden: false,
        },
      },
    })
    .render('#ideal-container')

  paypal
    .Buttons({
      fundingSource: paypal.FUNDING.IDEAL,

      style: {
        label: 'pay',
      },

      async createOrder(data, actions) {
        let envi = sessionStorage.environment // want to specify for createPaymentUrl
        if (serverSide === 'true') {
          let [prefix, queryParams] = src.split('?')
          console.log({ queryParams })
          if (envi === 'sandbox') {
            queryParams += '&sandbox=1'
          } else if (envi === 'live') {
            queryParams += '&live=1'
          }
          let authUrl = '/api/getauthtoken?' + queryParams
          let createPaymentUrl = '/api/createpayment?' + queryParams
          console.log({ envi })
          let accessToken = 'undefined'

          try {
            const authResponse = await fetch(authUrl, {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({ stage: envi }),
            })
            const authResponseJson = await authResponse.json()
            console.log({ authResponseJson })
            accessToken = authResponseJson.access_token
            console.log('accessToken: ' + accessToken)
          } catch (error) {
            console.error(error)
          }

          return fetch(createPaymentUrl, {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ stage: envi, order, accessToken }),
          })
            .then(res => res.json())
            .then(createOrderData => {
              console.log({ createOrderData })
              return createOrderData.id
            })
        }
        return actions.order.create(order).then(createdOrderReturn => {
          console.log({ createdOrderReturn })
          return createdOrderReturn
        })
      },

      onApprove(data, actions) {
        // Currently not being called. Aditya is working on it.
        console.log({ data, actions })
        return actions.order.capture().then(capturedata => {
          const capturedataString = JSON.stringify(capturedata, null, 2)
          console.log(capturedataString)
          alert(capturedataString)
        })
      },
    })
    .render('#ideal-btn')

  /* -----
SOFORT
------ */
  paypal
    .Marks({
      fundingSource: paypal.FUNDING.SOFORT,
    })
    .render('#sofort-mark')

  paypal
    .Fields({
      fundingSource: paypal.FUNDING.SOFORT,
      style,
      fields: {
        name: {
          value: name,
          hidden: false,
        },
      },
    })
    .render('#sofort-container')

  paypal
    .Buttons({
      fundingSource: paypal.FUNDING.SOFORT,

      style: {
        label: 'pay',
      },

      createOrder(data, actions) {
        return actions.order.create(order)
      },

      onApprove(data, actions) {
        return actions.order.capture().then(function(details) {
          alert(`Transaction completed by ${details.payer.name.given_name}!`)
        })
      },
    })
    .render('#sofort-btn')
}

/* -----
RADIO BUTTONS
------ */
// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.body.querySelector('#ideal-container').style.display = 'none'
        document.getElementById('ideal-btn').style.display = 'none'

        document.body.querySelector('#sofort-container').style.display = 'none'
        document.body.querySelector('#paypal-btn').style.display = 'block'

        document.getElementById('sofort-btn').style.display = 'none'

        break
      case 'ideal':
        document.body.querySelector('#ideal-container').style.display = 'block'
        document.getElementById('ideal-btn').style.display = 'block'

        document.body.querySelector('#sofort-container').style.display = 'none'
        document.body.querySelector('#paypal-btn').style.display = 'none'

        document.getElementById('sofort-btn').style.display = 'none'
        break

      case 'sofort':
        document.body.querySelector('#ideal-container').style.display = 'none'
        document.getElementById('ideal-btn').style.display = 'none'

        document.body.querySelector('#paypal-btn').style.display = 'none'

        document.body.querySelector('#sofort-container').style.display = 'block'
        document.getElementById('sofort-btn').style.display = 'block'
        break
      default:
        break
    }
  })
})

document.body.querySelector('#ideal-container').style.display = 'none'
document.getElementById('ideal-btn').style.display = 'none'

document.body.querySelector('#sofort-container').style.display = 'none'
document.getElementById('sofort-btn').style.display = 'none'
