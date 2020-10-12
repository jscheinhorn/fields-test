/* eslint-disable eqeqeq */
// Prevent 'enter' from clearing the form
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

// Environment selection elements
const envDropdown = document.getElementById('environment')
const testEnvDropdown = document.getElementById('test-env')
const otherTestEnv = document.getElementById('other-test-env')

// Display test environment options when one is already selected (case: back button)
if (
  typeof sessionStorage.environment !== 'undefined' &&
  sessionStorage.environment[0] === 't'
) {
  document.getElementById('test-env-div').style.display = 'block'
  envDropdown.selectedIndex = 3
}

// Envrionment dropdown options
envDropdown.onchange = function() {
  if (document.getElementById('currentEnv')) {
    document.getElementById('currentEnv').remove()
  }
  document.getElementById('warning').style.display = 'none'
  const envSelection = envDropdown.options[envDropdown.selectedIndex].value
  console.log({ envSelection })

  sessionStorage.environment = envSelection
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
  console.log(otherTestEnv.value)
  sessionStorage.environment = 'te-alm-' + otherTestEnv.value
})

// Prevent navigation if no test environment selected
document.getElementsByClassName('list-group')[0].onclick = function(event) {
  if (
    sessionStorage.environment === 'stage' ||
    sessionStorage.environment === 'other' ||
    sessionStorage.environment == false
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
