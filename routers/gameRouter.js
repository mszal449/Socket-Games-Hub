import express from 'express'
import auth from '../middleware/authentication.js'
const router = express.Router()

// Dashboard route
router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard.html', { user: req.user })
})

// Checkers route
router.get("/checkers", auth, (req, res) => {
    res.render("game.html", { user: req.user })
})

export default router
