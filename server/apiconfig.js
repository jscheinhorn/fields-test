import apienv from './apienv'

export function getAuthUrl(environment) {
  const apiConfig = getApiConfig(environment)
  const postAuthUrl = normalizeStageContext(apiConfig.authUrl, environment)
  return postAuthUrl
}

// get orderUrl based on environment
export function getOrderUrl(environment) {
  const apiConfig = getApiConfig(environment)
  const postPaymentUrl = normalizeStageContext(apiConfig.ordersUrl, environment)
  return postPaymentUrl
}

// TODO: Delete if not needed for server-side
// create ordersUrl based on environment
export function createOrderUrl(environment) {
  const apiConfig = getApiConfig(environment)
  const postPaymentUrl = normalizeStageContext(apiConfig.ordersUrl, environment)
  return postPaymentUrl
}

// Get the URLs for Direct API Calls
export function getApiConfig(environment) {
  let apiConfig
  switch (environment) {
    case 'live':
      apiConfig = apienv.LIVE
      break
    case 'sandbox':
      apiConfig = apienv.SANDBOX
      break
    default:
      apiConfig = apienv.MSMASTER
      break
  }
  return apiConfig
}

// If using a stage, replace 'msmaster' with test environment
export function normalizeStageContext(context, stage) {
  let newContext = context
  if (stage) {
    if (newContext.includes('msmaster')) {
      newContext = newContext.replace('msmaster.qa', 'heroku.stage')
    }
  }
  return newContext
}
