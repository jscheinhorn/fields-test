/* eslint-disable eqeqeq */
// Prevent 'enter' from clearing forms
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault()
})

// Pre-fill buyer information
document.getElementById('pre-fill').checked = sessionStorage.preFill
document.getElementById('pre-fill').addEventListener('click', function(event) {
  sessionStorage.preFill = event.target.checked
  console.log('event.target.checked: ', event.target.checked)
  console.log('sessionStorage.preFill : ', sessionStorage.preFill)
})
console.log('sessionStorage.preFill: ', sessionStorage.preFill)

// Server-side integration
document.getElementById('server-side').checked = sessionStorage.serverSide
document
  .getElementById('server-side')
  .addEventListener('click', function(event) {
    sessionStorage.serverSide = event.target.checked
    console.log('server-side checked: ', event.target.checked)
    console.log('sessionStorage.serverSide : ', sessionStorage.serverSide)
  })
console.log('sessionStorage.serverSide: ', sessionStorage.serverSide)

// Constants
const envDropdown = document.getElementById('environment')
const testEnvDropdown = document.getElementById('test-env')
const otherTestEnv = document.getElementById('other-test-env')
const clientId = document.getElementById('client-id')
sessionStorage.sandboxDefaultId =
  'AWpNai5MkBQDlnUmeYU02YHGOEkUs-ib8ufPtamRXZ_Uc8BuRJ6gCcaBZ-IVKBCBDtuw_7JRmbmdbERa'
sessionStorage.otherDefaultId =
  'AVVSS5kWC3KEdory_C7uev8yYIZyemM4BQC9tt-koQDL5iRgjTAkpypPaE29mEGy1eRFCAEOjGYWN1TC'

// Display test environment options when one is already selected (case: user hits back button)
if (
  typeof sessionStorage.environment !== 'undefined' &&
  sessionStorage.environment[0] === 't'
) {
  document.getElementById('test-env-div').style.display = 'block'
  envDropdown.selectedIndex = 3
}

// Retain custom client ID if already entered (case: user hits back button)
if (sessionStorage.environment === 'sandbox' && !sessionStorage.customId) {
  clientId.value = sessionStorage.sandboxDefaultId
} else if (!sessionStorage.customId) {
  clientId.value = sessionStorage.otherDefaultId
} else {
  clientId.value = sessionStorage.customId
}

// Envrionment dropdown options
envDropdown.onchange = function() {
  sessionStorage.customId = ''
  if (document.getElementById('currentEnv')) {
    document.getElementById('currentEnv').remove()
  }
  document.getElementById('warning').style.display = 'none'
  const envSelection = envDropdown.options[envDropdown.selectedIndex].value
  sessionStorage.environment = envSelection

  if (envSelection === 'sandbox') {
    clientId.value = sessionStorage.sandboxDefaultId
  } else {
    clientId.value = sessionStorage.otherDefaultId
  }
  if (envSelection === 'stage') {
    document.getElementById('test-env-div').style.display = 'block'
  } else {
    document.getElementById('test-env-div').style.display = 'none'
    document.getElementById('other-test-env-div').style.display = 'none'
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
  sessionStorage.environment = testEnvSelection
  if (testEnvSelection === 'other') {
    document.getElementById('other-test-env-div').style.display = 'block'
  } else {
    document.getElementById('other-test-env-div').style.display = 'none'
  }
}

// Accept custom test environment (stage)
otherTestEnv.addEventListener('input', function() {
  sessionStorage.environment = otherTestEnv.value
})
// Accept custom client id
console.log('custom client id: ', sessionStorage.customId)
clientId.addEventListener('input', function() {
  sessionStorage.customId = clientId.value
})

// Prevent navigation if no test environment selected
const listGroup = document.getElementsByClassName('list-group')[0]
listGroup.onclick = function(event) {
  const teServerSelected =
    sessionStorage.environment[0] === 't' &&
    sessionStorage.serverSide === 'true'
  if (teServerSelected) {
    event.preventDefault()
    $('#warningModal').modal('show')
    document.getElementById('redirect').onclick = function() {
      window.location.href = event.target.href
    }
  }
  console.log({ teServerSelected })
  if (
    sessionStorage.environment === 'stage' ||
    sessionStorage.environment === 'other' ||
    !sessionStorage.environment
  ) {
    event.preventDefault()
    document.getElementById('warning').style.display = 'block'
  }
}

// Display current environment
console.log('environment: ', sessionStorage.environment)
if (typeof sessionStorage.environment !== 'undefined') {
  let currenEnv = document.createElement('STRONG')
  currenEnv.setAttribute('id', 'currentEnv')
  const envi = sessionStorage.environment
    ? sessionStorage.environment
    : 'not selected'
  let textnode = document.createTextNode(`The current environment is ${envi}`)
  let brk = document.createElement('BR')
  currenEnv.append(textnode, brk) // Append the text to <strong>
  const envLabel = document.getElementById('envLabel')
  envLabel.before(currenEnv)
}
