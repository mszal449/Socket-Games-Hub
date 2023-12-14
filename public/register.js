import axios from './axiosInstance.js'

// Retrieve object models of form fields
const form = document.querySelector('form')
const username = document.querySelector('#usernameInput')
const password1 = document.querySelector('#passwordInput1')
const password2 = document.querySelector('#passwordInput1')
const alerts = document.querySelector('.alerts')


// Create an event listener for submit button
form.addEventListener('submit', async (e) => {
    // Reset website layout
    e.preventDefault()
    clearAlerts()


    // Register a new user with data retrieved from the form
    try {
        const response = await axios.post('/auth/register', {
            username: username.value,
            password1: password1.value,
            password2: password2.value,
            returnUrl: '/game/dashboard'
        })

        // Redirect or handle error
        if (response.data.error) {
            // Failure, show alerts
            displayAlert(response.data.error);
        } else {
            location.assign(response.data.returnUrl)
        }
    } catch (error) {
        // Handle errors
        if (error.response && error.response.data) {
            displayAlert(error.response.data.error);
        } else {
            displayAlert('Request failed. Please try again later.');
        }
    }
})


// Display alert in alerts div
const displayAlert = (message) => {
    const alertElement = document.createElement('div')
    alertElement.classList.add('alert', 'alert-danger')
    alertElement.role = 'alert'
    alertElement.textContent = message
    alerts.appendChild(alertElement)
}

// Clear all existing alerts
function clearAlerts() {
    while (alerts.firstChild) {
        alerts.removeChild(alerts.firstChild);
    }
}
