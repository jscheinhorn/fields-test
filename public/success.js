const successDetails = document.getElementById('success-details')
const successOrder = document.createTextNode(sessionStorage.orderData)
const successText = document.createTextNode(sessionStorage.captureData)

successDetails.appendChild(successText)
