// Selection of URLs from AltPaySimNodeweb
export default {
  LIVE: {
    // cred: {
    //   user: 'MF_UBIQ_testing1_api1.yahoo.com',
    //   pwd: '3Y5X8XGKNRVY7NT4',
    //   signature: 'AECJPsK3rSddO6YMTioJaz6RK1jGAAzXPmzwK32loDbYMQiJHLptKJbZ',
    //   actorAccountNumber: 'NotApplicable',
    // },
    apiHost: 'https://api-3t.paypal.com/nvp',
    postPaymentUrl: 'https://api.paypal.com/v1/payments/payment',
    cartUrl: 'https://api.paypal.com/v1/payments/carts',
    transactionUrl: 'https://api.paypal.com/v1/payments/sale',
    ordersUrl: 'https://api.paypal.com/v2/checkout/orders',
    authUrl: 'https://api.paypal.com/v1/oauth2/token',
    activitiesUrl: 'https://api.paypal.com/v1/activities/activities',
  },
  SANDBOX: {
    // cred: {
    //   user: 'linhxngo-facilitator_api1.hotmail.com',
    //   pwd: '1377636901',
    //   signature: 'AkU15udOsoZqnP3EZ.lCGituOAHZAcWU0GKsuwTbAwT--V2imjTpWYIS',
    //   actorAccountNumber: 'NotApplicable',
    //   // sb-rofdd2988290@business.example.com:
    //   client_id:
    //     'AWpNai5MkBQDlnUmeYU02YHGOEkUs-ib8ufPtamRXZ_Uc8BuRJ6gCcaBZ-IVKBCBDtuw_7JRmbmdbERa',
    //   secret:
    //     'EOYV9t8flvdduWPUPHW06SOrB95gM2Zs5itkGvX1-Mwf1FgD17lxgePUrKP5wgZe_1mKi3c4pzLYbsVV',
    // },
    apiHost: 'https://api-aa-3t.sandbox.paypal.com/nvp',
    postPaymentUrl: 'https://api.sandbox.paypal.com/v1/payments/payment',
    cartUrl: 'https://api.sandbox.paypal.com/v1/payments/carts',
    transactionUrl: 'https://api.sandbox.paypal.com/v1/payments/sale',
    ordersUrl: 'https://api.sandbox.paypal.com/v2/checkout/orders',
    authUrl: 'https://api.sandbox.paypal.com/v1/oauth2/token',
    activitiesUrl: 'https://api.sandbox.paypal.com/v1/activities/activities',
  },
  MSMASTER: {
    //   cred: {
    //     user: 'lingo-seller-GB_api1.paypal.com',
    //     pwd: '11111111',
    //     signature: 'AHZqghon1ZWMJwNV2JwJ2eLqGcIFAph-C2lnbANERyPo-MpdAnsiCiiN',
    //     actorAccountNumber: '1452904131972812942',
    //   },
    apiHost: 'https://api.msmaster.qa.paypal.com/nvp',
    postPaymentUrl: 'https://msmaster.qa.paypal.com:17266/v1/payments/payment',
    cartUrl: 'https://msmaster.qa.paypal.com:17266/v1/payments/carts',
    transactionUrl: 'https://msmaster.qa.paypal.com:11881/v1/payments/sale',
    ordersUrl: 'https://msmaster.qa.paypal.com:18824/v2/checkout/orders',
    capturesUrl: 'https://msmaster.qa.paypal.com:18824/v2/payments/captures',
    thirdPartyMerchantEmail: 'mbathula-merchant@paypal.com',
    authUrl: 'https://api.msmaster.qa.paypal.com:12714/v1/oauth2/token',
    activitiesUrl:
      'https://msmaster.qa.paypal.com:16156/v1/activities/activities',
  },
}
