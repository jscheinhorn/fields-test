import apienv from './apienv'

export function getAuthUrl({ live, sandbox, stage }) {
  const apiConfig = getApiConfig({ live, sandbox })
  const postAuthUrl = normalizeStageContext(apiConfig.authUrl, stage)
  return postAuthUrl
}

// TODO: Delete if not needed for server-side
// create ordersUrl based on environment
export function createOrderUrl({ live, sandbox, stage }) {
  const apiConfig = getApiConfig({ live, sandbox })
  const postPaymentUrl = normalizeStageContext(apiConfig.ordersUrl, stage)
  return postPaymentUrl
}

// Get the URLs for Direct API Calls
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
