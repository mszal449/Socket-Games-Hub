const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

// Define register and login before using them in the router
router.post('/register', register);
router.post('/login', login);

module.exports = router;
