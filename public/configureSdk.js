export default function configureSdk() {
  let clientId
  let src = 'https://www.'
  const params =
    '&components=buttons,fields,marks&buyer-country=NL&currency=EUR'
  const payPalSdk = {
    sandbox: 'paypal.com/sdk/js?',
    msmaster: 'msmaster.qa.paypal.com/sdk/js?',
    testEnv: '.qa.paypal.com/sdk/js?',
  }

  switch (sessionStorage.environment) {
    case 'sandbox':
      src += payPalSdk.sandbox
      clientId = sessionStorage.customId
        ? sessionStorage.customId
        : sessionStorage.sandboxDefaultId
      break
    case 'msmaster':
      src += payPalSdk.msmaster
      clientId = sessionStorage.customId
        ? sessionStorage.customId
        : sessionStorage.otherDefaultId
      break
    default:
      src += sessionStorage.environment + payPalSdk.testEnv
      clientId = sessionStorage.customId
        ? sessionStorage.customId
        : sessionStorage.otherDefaultId
  }
  src += `client-id=${clientId}` + params
  console.log({ clientId })
  console.log({ src })

  return src
}
