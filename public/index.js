/* eslint-disable no-fallthrough */
/* eslint-disable eqeqeq */

// Constants
const envDropdown = document.getElementById('environment')
const testEnvDropdown = document.getElementById('test-env')
const otherTestEnv = document.getElementById('other-test-env')
const clientId = document.getElementById('client-id')
const testEnvDiv = document.getElementById('test-env-div')
const otherTestEnvDiv = document.getElementById('other-test-env-div')

// Get Merchant Client ID
async function getClientId(environment) {
  const clientIds = await fetch('/api/clientid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ environment }),
  })
  let response = await clientIds.json()
  console.log({ response })
  return response
}

// Envrionment dropdown options
envDropdown.onchange = async function() {
  document.getElementById('warning').style.display = 'none'
  const envSelection = envDropdown.options[envDropdown.selectedIndex].value
  console.log({ envSelection })
  let clientIdVal = await getClientId(envSelection)
  clientId.value = clientIdVal
  console.log({ clientIdVal })
  const clientIdDiv = document.getElementById('client-id-div')

  switch (envSelection) {
    case 'sandbox':
      clientIdDiv.style.display = 'none'
    case 'live':
      clientIdDiv.style.display = 'none'
      break
    default:
      clientIdDiv.style.display = 'block'
  }

  if (envSelection === 'stage') {
    testEnvDiv.style.display = 'block'
    if (serverSideCheck.checked) {
      $('#warningModal').modal('show')
    }
  } else {
    testEnvDiv.style.display = 'none'
    otherTestEnvDiv.style.display = 'none'
  }
}

// Test environment dropdown options
testEnvDropdown.onchange = function() {
  document.getElementById('warning').style.display = 'none'
  const testEnvSelection =
    testEnvDropdown.options[testEnvDropdown.selectedIndex].value
  console.log({ testEnvSelection })
  if (testEnvSelection === 'other') {
    otherTestEnvDiv.style.display = 'block'
  } else {
    otherTestEnvDiv.style.display = 'none'
  }
}

// TODO: Show modal if desired or delete
// serverSideCheck.onclick = () => {
//   if (serverSideCheck.checked && envDropdown.value === 'stage') {
//     $('#warningModal').modal('show')
//   }
// }

// Select all APMs
let allClicked = false
document.getElementById('all').onclick = () => {
  allClicked = !allClicked
  for (let element of document.getElementsByClassName('apm')) {
    element.children[0].checked = allClicked
  }
}

// Prevent navigation if no test environment selected
const form = document.getElementById('form')
form.onsubmit = function(event) {
  const selectElements = document.getElementsByTagName('select')
  const env = selectElements[0].value
  const testEnv = selectElements[1].value
  console.log({ env, testEnv })
  if (
    env === '0' ||
    (env === 'stage' && testEnv === '0') ||
    (testEnv === 'other' && otherTestEnv.value === '')
  ) {
    event.preventDefault()
    document.getElementById('warning').style.display = 'block'
  }
  // TODO: ALSO DO NOT GO WITHOUT AT LEAST ONE APM SELECTED
}
