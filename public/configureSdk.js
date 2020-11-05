export default function configureSdk(clientId, environment) {
  let src = 'https://www.'
  const params =
    '&components=buttons,fields,marks&buyer-country=NL&currency=EUR'
  const payPalSdk = {
    sandbox: 'paypal.com/sdk/js?',
    msmaster: 'msmaster.qa.paypal.com/sdk/js?',
    testEnv: '.qa.paypal.com/sdk/js?',
  }

  switch (environment) {
    case 'sandbox':
      src += payPalSdk.sandbox
      break
    case 'msmaster':
      src += payPalSdk.msmaster
      break
    default:
      // TODO: environment here will be test-env
      src += environment + payPalSdk.testEnv
  }
  src += `client-id=${clientId}` + params
  console.log({ clientId })
  console.log({ src })

  return src
}
