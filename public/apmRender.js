/* eslint-disable no-loop-func */
/* eslint-disable max-statements */
/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */
export default function apmRender(apm, style, order, urlParams, environment) {
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
  RENDER APMs
  ------ */
  for (let apmKey in apm) {
    if (apm[apmKey]) {
      console.log({ apmKey })
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
      document.body.querySelector(`#${apmKey}-container`).style.display = 'none'
      document.getElementById(`${apmKey}-btn`).style.display = 'none'

      paypal
        .Marks({
          fundingSource: paypal.FUNDING[`${apmKey.toUpperCase()}`],
        })
        .render(`#${apmKey}-mark`)

      paypal
        .Fields({
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
        .render(`#${apmKey}-container`)

      paypal
        .Buttons({
          fundingSource: paypal.FUNDING[`${apmKey.toUpperCase()}`],

          style: {
            label: 'pay',
          },

          async createOrder(data, actions) {
            // TODO: want to specify for createPaymentUrl
            // here environment will be msmaster, sandbox or 'stage'
            // Follow the breadcrumbs...
            let clientId = urlParams.get('client-id')
            let queryParams = `client-id=${clientId}`
            if (urlParams.get('pre-fill') === '1') {
              // TODO: check this pre-fill logic
              console.log({ queryParams })
              if (environment === 'sandbox') {
                queryParams += '&sandbox=1'
              } else if (environment === 'live') {
                queryParams += '&live=1'
              }
              let authUrl = '/api/getauthtoken?' + queryParams
              let createPaymentUrl = '/api/createpayment?' + queryParams
              console.log({ environment })
              let accessToken = 'undefined'

              try {
                const authResponse = await fetch(authUrl, {
                  method: 'post',
                  headers: {
                    'content-type': 'application/json',
                  },
                  body: JSON.stringify({ stage: environment }),
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
                body: JSON.stringify({
                  stage: environment,
                  order,
                  accessToken,
                }),
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
        .render(`#${apmKey}-btn`)
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
