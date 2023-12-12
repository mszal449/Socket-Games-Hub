import express from 'express'
import { register, login, logout } from '../controllers/auth.js'
import auth from '../middleware/authentication.js'
const router = express.Router()

// Register page route
router.get('/register', auth, (req, res) => {
    if (req.user && req.user.authenticated === true) {
        // If user is authenticated, redirect to dashboard
        res.redirect('/main/dashboard')
    } else {
        // If user is not authenticated, clear token and render register page
        res.clearCookie('token')
        res.render('register.html', { title: 'Register' })
    }
})

// Login page route
router.get('/login', auth, (req, res) => {
    if (req.user && req.user.authenticated === true) {
        // If user is authenticated, redirect to dashboard
        res.redirect('/main/dashboard')
    } else {
        // If user is not authenticated, clear token and render login page
        res.clearCookie('token')
        res.render('login.html', { title: 'Login' })
    }
})

// Log out route
router.get('/logout', logout)

// Form submission routes
router.post('/register', register)
router.post('/login', login)

export default router
