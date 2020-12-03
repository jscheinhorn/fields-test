/* eslint-disable no-loop-func */
/* eslint-disable max-statements */
/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */
// import swal from 'sweetalert'

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
            // let clientId = urlParams.get('client-id')
            // let queryParams = `client-id=${clientId}`
            // let authUrl = '/api/getauthtoken?' + queryParams
            // let accessToken = 'undefined'
            // try {
            //   const authResponse = await fetch(authUrl, {
            //     method: 'post',
            //     headers: {
            //       'content-type': 'application/json',
            //     },
            //     body: JSON.stringify({ environment }),
            //   })
            //   const authResponseJson = await authResponse.json()
            //   accessToken = authResponseJson.access_token
            //   console.log({ accessToken })
            // } catch (error) {
            //   console.error(error)
            // }
            return actions.order.create(order)
            // .then(orderId => {
            //   let getOrderUrl = '/api/getorder?order-id=' + orderId
            //   console.log({ orderId })
            //   sessionStorage.orderId = orderId
            //   console.log('sessionStorage.orderId: ', sessionStorage.orderId)
            //   return fetch(getOrderUrl, {
            //     method: 'post',
            //     headers: {
            //       'content-type': 'application/json',
            //     },
            //     body: JSON.stringify({ accessToken }),
            //   })
            // })
            // .then(orderDetails => {
            //   return orderDetails.json()
            // })
            // .then(orderDetailsJson => {
            //   console.log({ orderDetailsJson })
            //   return orderDetailsJson.id
            // })
          },

          async onApprove(data, actions) {
            // Called after returning form the bank page
            console.log({ data, actions })
            // let orderDetailsOnApprove = await actions.order.get();
            // console.log('orderDetailsOnApprove json: ',await orderDetailsOnApprove.json())
            const webhookurl = '/api/webhook'
            let hook = await fetch(webhookurl, {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({ data, actions, event_type: 'none' }),
            })
            console.log({ hook })
            let hookJson = await hook.json()
            console.log({ hookJson })
            return actions.order.capture().then(capturedata => {
              const capturedataString = JSON.stringify(capturedata, null, 2)
              console.log({ capturedataString })
              sessionStorage.captureData = capturedataString
              // alert(capturedataString)
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
