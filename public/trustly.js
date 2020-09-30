/* eslint-disable consistent-return, new-cap, no-alert, no-console */

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
Trustly
------ */

paypal
  .Marks({
    fundingSource: paypal.FUNDING.TRUSTLY,
  })
  .render('#trustly-mark')

paypal
  .Fields({
    fundingSource: paypal.FUNDING.TRUSTLY,
    style,
    fields: {
      name: {
        value: 'John Smith',
        hidden: false,
      },
    },
  })
  .render('#trustly-container')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.TRUSTLY,

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
  .render('#trustly-btn')

/* -----
RADIO BUTTONS
------ */
// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.getElementById('trustly-container').style.display = 'none'
        document.getElementById('trustly-btn').style.display = 'none'

        document.getElementById('paypal-btn').style.display = 'block'

        break
      case 'trustly':
        document.getElementById('trustly-container').style.display = 'block'
        document.getElementById('trustly-btn').style.display = 'block'

        document.getElementById('paypal-btn').style.display = 'none'
        break

      default:
        break
    }
  })
})

document.getElementById('trustly-container').style.display = 'none'
document.getElementById('trustly-btn').style.display = 'none'
