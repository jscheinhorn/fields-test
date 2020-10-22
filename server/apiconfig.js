import apienv from './apienv'

export function getAuthUrl({ live, sandbox, stage }) {
  const apiConfig = getApiConfig({ live, sandbox })
  const postAuthUrl = normalizeStageContext(apiConfig.authUrl, stage)

  return postAuthUrl
}

// create ordersUrl based on environment
export function createOrderUrl({ live, sandbox, stage }) {
  const apiConfig = getApiConfig({ live, sandbox })
  console.log('*** *** STAGE for Create Order *** ***', stage)
  const postPaymentUrl = normalizeStageContext(apiConfig.ordersUrl, stage)
  console.log({ postPaymentUrl })

  return postPaymentUrl
}

// Get the URLs for server-side implementation
export function getApiConfig({ live, sandbox }) {
  let apiConfig
  if (live) {
    apiConfig = apienv.LIVE
  } else if (sandbox) {
    apiConfig = apienv.SANDBOX
  } else {
    apiConfig = apienv.MSMASTER
  }
  return apiConfig
}

// If using a stage, replace 'msmaster' with test environment
export function normalizeStageContext(context, stage) {
  let newContext = context
  if (stage) {
    if (newContext.includes('msmaster')) {
      newContext = newContext.replace('msmaster', stage)
    }
  }
  return newContext
}

// Not currently using.
//   export function getDefaultCred({ live, sandbox, thirdParty }) {
//     const apiConfig = getApiConfig({ live, sandbox });
//     const cred = Object.assign({}, apiConfig.cred);
//     if (thirdParty) {
//       cred.thirdPartyMerchantEmail = apiConfig.thirdPartyMerchantEmail;
//     }
//     return cred;
//   }
