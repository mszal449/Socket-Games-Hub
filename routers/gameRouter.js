import express from 'express'
const router = express.Router()

// Dashboard route
router.get('/dashboard', (req, res) => {
    res.render('dashboard.html', { user: req.user });
})

export default router