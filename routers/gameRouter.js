import express from 'express'
import auth from '../middleware/authentication.js'
const router = express.Router()

// Dashboard route
router.get('/dashboard', auth, (req, res) => {
    if (req.user && req.user.authenticated) {
        // If user is authenticated, render the page
        res.render('dashboard.html', { user: req.user });
    } else {
        // Else redirect to login page
        res.redirect('/auth/login');
    }
})


router.get("/checkers", auth, (req, res) => {
    if (req.user && req.user.authenticated) {
        // If user is authenticated, render the page
        res.render("game.html", { user: req.user })
    } else {
        // Else redirect to login page
        res.redirect('/auth/login');
    }
})

export default router

