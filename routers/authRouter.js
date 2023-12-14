import express from 'express'
import { register, login, logout } from '../controllers/auth.js'
import auth from '../middleware/authentication.js'
const router = express.Router()

// Register page route
router.get('/register', (req, res) => {
    if (req.signedCookies.user) {
        // If user is authenticated, redirect to dashboard
        res.redirect('/game/dashboard')
    } else {
        // If user is not authenticated, clear token and render register page
        res.render('register.html', { title: 'Register' })
    }
})

// Login page route
router.get('/login', (req, res) => {
    if (req.signedCookies.user) {
        // If user is authenticated, redirect to dashboard
        res.redirect('/game/dashboard')
    } else {
        // If user is not authenticated, clear token and render register page
        res.render('login.html', {title: 'Login'})
    }
})

// Log out route
router.get('/logout', auth, logout)

// Form submission routes
router.post('/register', register)
router.post('/login', login)

export default router
