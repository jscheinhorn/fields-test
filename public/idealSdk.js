payPalSdk = {
  sandbox:
    'paypal.com/sdk/js?client-id=AWpNai5MkBQDlnUmeYU02YHGOEkUs-ib8ufPtamRXZ_Uc8BuRJ6gCcaBZ-IVKBCBDtuw_7JRmbmdbERa&components=buttons,fields,marks&buyer-country=NL&currency=EUR',
  msmaster:
    'msmaster.qa.paypal.com/sdk/js?client-id=AVVSS5kWC3KEdory_C7uev8yYIZyemM4BQC9tt-koQDL5iRgjTAkpypPaE29mEGy1eRFCAEOjGYWN1TC&components=buttons,fields,marks&buyer-country=NL&currency=EUR',
  testEnv:
    '.qa.paypal.com/sdk/js?client-id=AVVSS5kWC3KEdory_C7uev8yYIZyemM4BQC9tt-koQDL5iRgjTAkpypPaE29mEGy1eRFCAEOjGYWN1TC&components=buttons,fields,marks&buyer-country=NL&currency=EUR',
}
let src = 'https://www.'
switch (sessionStorage.environment) {
  case 'sandbox':
    src += payPalSdk.sandbox
    break
  case 'msmaster':
    src += payPalSdk.msmaster
    break
  default:
    src += sessionStorage.environment + payPalSdk.testEnv
}
console.log({ src })

let script1 = document.createElement('SCRIPT')
script1.src = src
document.getElementsByTagName('HEAD')[0].appendChild(script1)
