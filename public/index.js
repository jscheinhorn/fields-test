/* eslint-disable eqeqeq */
document.querySelector('form').addEventListener('submit', function(event) {
  // prevent 'enter' from clearing the form
  event.preventDefault()
})

// Pre-fill buyer information
document.getElementById('pre-fill').checked = sessionStorage.preFill

document.getElementById('pre-fill').addEventListener('click', function(event) {
  sessionStorage.preFill = event.target.checked
  console.log('event.target.checked: ', event.target.checked)
  console.log('sessionStorage.preFill clicked: ', sessionStorage.preFill)
})

console.log('sessionStorage.preFill: ', sessionStorage.preFill)

// Environment options (stage, msmaster, or te-alm-...)
const envDropdown = document.getElementById('environment')
const testEnvDropdown = document.getElementById('test-env')
const otherTestEnv = document.getElementById('other-test-env')

envDropdown.onchange = function() {
  document.getElementById('currentEnv').remove()
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

  // Test-environment options
  testEnvDropdown.onchange = function() {
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
  // Custom test-environment (stage)
  otherTestEnv.addEventListener('input', function() {
    console.log(otherTestEnv.value)
    sessionStorage.environment = 'te-alm-' + otherTestEnv.value
  })
}

document.getElementsByClassName('list-group')[0].onclick = function(event) {
  if (sessionStorage.environment === 'stage') {
    event.preventDefault()
    document.getElementById('warning').style.display = 'block'
  }
}

console.log('environment: ', sessionStorage.environment)
const envi = sessionStorage.environment
if (envi !== undefined) {
  let node = document.createElement('STRONG') // Create a <strong> node
  node.setAttribute('id', 'currentEnv')
  let textnode = document.createTextNode(`The current environment is ${envi}`) // Create a text node
  let brk = document.createElement('BR')
  node.append(textnode, brk) // Append the text to <strong>
  const envLabel = document.getElementById('envLabel')
  envLabel.before(node)
}
