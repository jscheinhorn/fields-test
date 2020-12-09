/* eslint-disable no-loop-func */
/* eslint-disable max-statements */
/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */

export default function apmRender(
  apm,
  style,
  order,
  urlParams,
  environment,
  name,
) {
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
        return actions.order.capture()
      },
    })
    .render('#paypal-btn')

  /* -----
  RENDER APMs
  ------ */
  for (let apmKey in apm) {
    if (apm[apmKey]) {
      console.log({ apmKey })

      let mark = paypal.Marks({
        fundingSource: paypal.FUNDING[`${apmKey.toUpperCase()}`],
      })
      if (mark.isEligible()) {
        let label = document.createElement('label')
        let input = document.createElement('input')
        let span = document.createElement('span')
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', 'payment-option')
        input.setAttribute('value', `${apmKey}`)
        input.setAttribute('id', `${apmKey}-radio`)
        input.setAttribute('class', 'apm-radio')
        span.setAttribute('id', `${apmKey}-mark`)
        span.setAttribute('class', 'apm-mark')
        div1.setAttribute('id', `${apmKey}-container`)
        div1.setAttribute('class', 'apm-container')
        div2.setAttribute('id', `${apmKey}-btn`)
        div2.setAttribute('class', 'apm-btn')
        label.appendChild(input)
        label.appendChild(span)
        document.getElementById('apm-radios').appendChild(label)
        document.getElementById('apm-radios').appendChild(div1)
        document.getElementById('buttons').appendChild(div2)
        document.body.querySelector(`#${apmKey}-container`).style.display =
          'none'
        document.getElementById(`${apmKey}-btn`).style.display = 'none'
        mark.render(`#${apmKey}-mark`)
      }

      let field = paypal.Fields({
        fundingSource: paypal.FUNDING[`${apmKey.toUpperCase()}`],
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
      if (field.isEligible() && mark.isEligible()) {
        field.render(`#${apmKey}-container`)
      }

      let button = paypal.Buttons({
        fundingSource: paypal.FUNDING[`${apmKey.toUpperCase()}`],

        style: {
          label: 'pay',
        },

        async createOrder(data, actions) {
          return actions.order.create(order)
        },

        // Called after returning from the bank page
        async onApprove(data, actions) {
          console.log({ data, actions })
          let authUrl = '/api/getauthtoken?'
          let accessToken = 'undefined'
          try {
            const authResponse = await fetch(authUrl, {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({ environment }),
            })
            const authResponseJson = await authResponse.json()
            accessToken = authResponseJson.access_token
            console.log({ accessToken })
          } catch (error) {
            console.error(error)
          }

          const captureUrl = '/api/capture'
          let captureReturn = await fetch(captureUrl, {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              order: data.orderID,
              environment,
              accessToken,
            }),
          })
          // console.log(await captureReturn.json())
          document.getElementById('modal-body').innerText = JSON.stringify(data)
          $('#warningModal').modal('show')
          return captureReturn
        },
      })
      if (button.isEligible()) {
        button.render(`#${apmKey}-btn`)
      }
    }
  }

  /* -----
  RADIO BUTTONS
  ------ */
  // Listen for changes to the radio buttons
  const radios = document.querySelectorAll('.apm-radio')
  console.log({ radios })
  radios.forEach(el => {
    // handle button toggles
    el.addEventListener('change', event => {
      console.log(event.target.value + ' radio button clicked')
      const btns = document.querySelectorAll('.apm-btn')
      const containers = document.querySelectorAll('.apm-container')
      document.getElementById(`${event.target.value}-btn`).style.display =
        'block'
      if (event.target.value !== 'paypal') {
        document.getElementById(
          `${event.target.value}-container`,
        ).style.display = 'block'
      }

      btns.forEach(button => {
        if (event.target.value !== button.id.split('-')[0]) {
          button.style.display = 'none'
        }
      })
      containers.forEach(container => {
        if (event.target.value !== container.id.split('-')[0]) {
          container.style.display = 'none'
        }
      })
    })
  })
}
