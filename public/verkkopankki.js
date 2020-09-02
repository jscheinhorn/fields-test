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
        alert('Transaction completed by ' + details.payer.name.given_name + '!')
      })
    },
  })
  .render('#paypal-btn')

/* -----
verkkopankki
------ */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.VERKKOPANKKI,
  })
  .render('#verkkopankki-mark')

paypal
  .Fields({
    fundingSource: paypal.FUNDING.VERKKOPANKKI,
    style,
    fields: {
      name: {
        value: 'Louis van Gaal',
        hidden: false,
      },
    },
  })
  .render('#verkkopankki-container')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.VERKKOPANKKI,

    style: {
      label: 'pay',
    },

    createOrder(data, actions) {
      return actions.order.create(order)
    },

    onApprove(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name + '!')
      })
    },
  })
  .render('#verkkopankki-btn')

/* -----
RADIO BUTTONS
------ */
// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.getElementById('verkkopankki-container').style.display = 'none'
        document.getElementById('verkkopankki-btn').style.display = 'none'

        document.getElementById('paypal-btn').style.display = 'block'

        break
      case 'verkkopankki':
        document.getElementById('verkkopankki-container').style.display =
          'block'
        document.getElementById('verkkopankki-btn').style.display = 'block'

        document.getElementById('paypal-btn').style.display = 'none'
        break

      default:
        break
    }
  })
})

document.getElementById('verkkopankki-container').style.display = 'none'
document.getElementById('verkkopankki-btn').style.display = 'none'
