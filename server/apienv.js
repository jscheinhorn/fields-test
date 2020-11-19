// Selection of URLs sourced from AltPaySimNodeweb
export default {
  LIVE: {
    apiHost: 'https://api-3t.paypal.com/nvp',
    postPaymentUrl: 'https://api.paypal.com/v1/payments/payment',
    cartUrl: 'https://api.paypal.com/v1/payments/carts',
    transactionUrl: 'https://api.paypal.com/v1/payments/sale',
    ordersUrl: 'https://api.paypal.com/v2/checkout/orders',
    authUrl: 'https://api.paypal.com/v1/oauth2/token',
    activitiesUrl: 'https://api.paypal.com/v1/activities/activities',
  },
  SANDBOX: {
    apiHost: 'https://api-aa-3t.sandbox.paypal.com/nvp',
    postPaymentUrl: 'https://api.sandbox.paypal.com/v1/payments/payment',
    cartUrl: 'https://api.sandbox.paypal.com/v1/payments/carts',
    transactionUrl: 'https://api.sandbox.paypal.com/v1/payments/sale',
    ordersUrl: 'https://api.sandbox.paypal.com/v2/checkout/orders',
    authUrl: 'https://api.sandbox.paypal.com/v1/oauth2/token',
    activitiesUrl: 'https://api.sandbox.paypal.com/v1/activities/activities',
  },
  MSMASTER: {
    apiHost: 'https://api.msmaster.qa.paypal.com/nvp',
    postPaymentUrl: 'https://msmaster.qa.paypal.com:17266/v1/payments/payment',
    cartUrl: 'https://msmaster.qa.paypal.com:17266/v1/payments/carts',
    transactionUrl: 'https://msmaster.qa.paypal.com:11881/v1/payments/sale',
    ordersUrl: 'https://msmaster.qa.paypal.com:12326/v2/checkout/orders',
    capturesUrl: 'https://msmaster.qa.paypal.com:18824/v2/payments/captures',
    thirdPartyMerchantEmail: 'mbathula-merchant@paypal.com',
    authUrl: 'https://api.msmaster.qa.paypal.com:12714/v1/oauth2/token',
    activitiesUrl:
      'https://msmaster.qa.paypal.com:16156/v1/activities/activities',
  },
}
