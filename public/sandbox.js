/* eslint-disable new-cap */
paypal
  .Buttons({
    createOrder(data, actions) {
      // Set up the transaction
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: '0.01',
            },
          },
        ],
      })
    },
    onApprove(data, actions) {
      // This function captures the funds from the transaction.
      // eslint-disable-next-line promise/always-return
      return actions.order.capture().then(function(details) {
        // This function shows a transaction success message to your buyer.
        console.log({ details })
      })
    },
  })
  .render('#buttons')
