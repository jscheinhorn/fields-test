/* eslint-disable eqeqeq */
// Prevent 'enter' from clearing forms
// document.querySelector('form').addEventListener('submit', function(event) {
//   event.preventDefault()
// })

// Constants
const envDropdown = document.getElementById('environment')
const testEnvDropdown = document.getElementById('test-env')
const otherTestEnv = document.getElementById('other-test-env')
const clientId = document.getElementById('client-id')
const serverSideCheck = document.getElementById('server-side')
const testEnvDiv = document.getElementById('test-env-div')
const otherTestEnvDiv = document.getElementById('other-test-env-div')
const sandboxDefaultId =
  'AWpNai5MkBQDlnUmeYU02YHGOEkUs-ib8ufPtamRXZ_Uc8BuRJ6gCcaBZ-IVKBCBDtuw_7JRmbmdbERa'
const otherDefaultId =
  'AVVSS5kWC3KEdory_C7uev8yYIZyemM4BQC9tt-koQDL5iRgjTAkpypPaE29mEGy1eRFCAEOjGYWN1TC'

// Envrionment dropdown options
envDropdown.onchange = function() {
  if (document.getElementById('currentEnv')) {
    document.getElementById('currentEnv').remove()
  }
  document.getElementById('warning').style.display = 'none'
  const envSelection = envDropdown.options[envDropdown.selectedIndex].value
  if (envSelection === 'sandbox') {
    clientId.value = sandboxDefaultId
  } else {
    clientId.value = otherDefaultId
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
  if (document.getElementById('currentEnv')) {
    document.getElementById('currentEnv').remove()
  }
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

// Show modal when server-side and stage are selected
serverSideCheck.onclick = () => {
  if (serverSideCheck.checked && envDropdown.value === 'stage') {
    $('#warningModal').modal('show')
  }
}

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

// Display current environment
// TODO: Either update or eliminate
// console.log('environment: ', sessionStorage.environment)
// if (typeof sessionStorage.environment !== 'undefined') {
//   let currenEnv = document.createElement('STRONG')
//   currenEnv.setAttribute('id', 'currentEnv')
//   const envi = sessionStorage.environment
//     ? sessionStorage.environment
//     : 'not selected'
//   let textnode = document.createTextNode(`The current environment is ${envi}`)
//   let brk = document.createElement('BR')
//   currenEnv.append(textnode, brk) // Append the text to <strong>
//   const envLabel = document.getElementById('envLabel')
//   envLabel.before(currenEnv)
// }
