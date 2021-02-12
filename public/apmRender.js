/* eslint-disable no-loop-func */
/* eslint-disable max-statements */
/* eslint-disable promise/always-return */
/* eslint-disable consistent-return, new-cap, no-alert, no-console */

export default function apmRender(
  apm,
  style,
  order,
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
          },
          email: {
            value: name.trim() + '@test.com',
          },
        },
      })
      if (field.isEligible() && mark.isEligible()) {
        field.render(`#${apmKey}-container`)
      } else {
        console.log(
          `${apmKey} eligibility: field-${field.isEligible()} mark-${mark.isEligible()}`,
        )
      }

      let button = paypal.Buttons({
        fundingSource: paypal.FUNDING[`${apmKey.toUpperCase()}`],
        upgradeLSAT: true,
        style: {
          label: 'pay',
        },

        createOrder(data, actions) {
          /** Used to Test if Accepts Existing Order **/
          // let fetchData = {order, environment}
          // return fetch('/api/createorder', {
          //   method: 'post',
          //   headers: {
          //       'content-type': 'application/json',
          //     },
          //   body: JSON.stringify(fetchData)
          // }).then(orderInfo => orderInfo.json())
          // .then(orderInfoJson => orderInfoJson.id)
          return actions.order.create(order)
        },

        // Called after returning from the bank page
        // Order is captured via webhook
        async onApprove(data, actions) {
          console.log({ data, actions })

          // Display order status and details in modal
          const getOrderUrl = `/api/getorder?order-id=${data.orderID}`
          setTimeout(() => {
            fetch(getOrderUrl, {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({ environment }),
            })
              .then(orderDetails => orderDetails.json())
              .then(orderDetailsJson => {
                document.getElementById(
                  'modal-body',
                ).innerHTML = `<strong>Order Approved: </strong>\n ${JSON.stringify(
                  orderDetailsJson,
                )}`
                $('#warningModal').modal('show')
                return orderDetailsJson
              })
          }, 30000)
        },

        async onCancel(data, actions) {
          const getOrderUrl = `/api/getorder?order-id=${data.orderID}`
          fetch(getOrderUrl, {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ environment }),
          })
            .then(orderDetails => orderDetails.json())
            .then(orderDetailsJson => {
              document.getElementById(
                'modal-body',
              ).innerHTML = `<strong>Order Cancelled: </strong>\n ${JSON.stringify(
                orderDetailsJson,
              )}`
              $('#warningModal').modal('show')
              return orderDetailsJson
            })
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
