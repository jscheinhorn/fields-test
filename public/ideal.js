/* eslint-disable consistent-return, new-cap, no-alert, no-console */
payPalSdk = {
  sandbox:
    'paypal.com/sdk/js?client-id=AWpNai5MkBQDlnUmeYU02YHGOEkUs-ib8ufPtamRXZ_Uc8BuRJ6gCcaBZ-IVKBCBDtuw_7JRmbmdbERa&components=buttons,fields,marks&buyer-country=NL&currency=EUR',
  msmaster:
    'msmaster.qa.paypal.com/sdk/js?client-id=AVVSS5kWC3KEdory_C7uev8yYIZyemM4BQC9tt-koQDL5iRgjTAkpypPaE29mEGy1eRFCAEOjGYWN1TC&components=buttons,fields,marks&buyer-country=NL&currency=EUR',
  testEnv:
    '.qa.paypal.com/sdk/js?client-id=AVVSS5kWC3KEdory_C7uev8yYIZyemM4BQC9tt-koQDL5iRgjTAkpypPaE29mEGy1eRFCAEOjGYWN1TC&components=buttons,fields,marks&buyer-country=NL&currency=EUR',
}
let src = 'https://www.'
switch (sessionStorage.environment) {
  case 'sandbox':
    src += payPalSdk.sandbox
    break
  case 'msmaster':
    src += payPalSdk.msmaster
    break
  default:
    src += sessionStorage.environment + payPalSdk.testEnv
}
console.log({ src })

let script1 = document.createElement('SCRIPT')
script1.src = src
script1.onload = idealRender
document.head.appendChild(script1)
// document.getElementsByTagName('HEAD')[0].appendChild(script1)
// let script2 = document.createElement('SCRIPT')
// script2.src = '/ideal.js'
// document.getElementsByTagName('BODY')[0].appendChild(script2)

const preFill = sessionStorage.preFill
console.log({ preFill })
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

      createOrder(data, actions) {
        return actions.order.create(order)
      },

      onApprove(data, actions) {
        return actions.order.capture().then(function(details) {
          alert(`Transaction completed by ${details.payer.name.given_name}!`)
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
