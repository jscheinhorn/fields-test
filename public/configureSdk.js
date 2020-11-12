export default function configureSdk(
  clientId,
  environment,
  apm,
  buyerCountry,
  currency,
) {
  let src = 'https://www.'
  let fundingList = ''
  for (let apmKey in apm) {
    if (apm[apmKey]) {
      fundingList += apmKey + ','
    }
  }
  fundingList = fundingList.slice(0, -1)
  console.log({ fundingList })
  console.log({ buyerCountry })
  const params = `&components=buttons,fields,marks,funding-eligibility&enable-funding=${fundingList}&buyer-country=${buyerCountry}&currency=${currency}`
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
