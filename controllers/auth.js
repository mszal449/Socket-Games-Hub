import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'

// Register user
async function register(req, res) {
    const { username, password1, password2} = req.body
    const returnUrl = req.params.returnUrl || req.body.returnUrl

    // Check if all fields are filled out
    if (!username || !password1 || !password2) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'All fields are required' })
    }

    // Check if username is available
    const check = await User.findOne({ username: username })
    if (check) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'This username is already taken.' })
    }

    // Check if given passwords are the same
    if (password1.value !== password2.value) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Passwords must be the same' })
    }

    // Check if passwords is at least 8 characters long
    if (password1.length < 8) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Password must be at least 8 characters long.' })
    }

    // Create user registration object
    const userData = {
        username: username,
        password: password1
    }

    // Create new user record in the database
    const user = await User.create(userData)

    // Save token inside a cookie and redirect
    res.cookie('user', user.username, { signed: true })
    res.status(StatusCodes.OK).json({ returnUrl: returnUrl})
}

// Login an existing user
async function login(req, res) {
    const { username, password } = req.body
    const returnUrl = req.params.returnUrl || req.body.returnUrl

    // Check if username and password are given
    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Username and password are required.' })
    }

    // Check if the user exists
    const user = await User.findOne({ username })
    if (!user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Invalid username or password.' })
    }

    // Validate password
    const isPasswordCorrect = await user.comparePasswords(password)
    if (!isPasswordCorrect) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Invalid username or password.' })
    }

    // Save token inside a cookie and redirect
    res.cookie('user', user.username, { signed: true })
    res.status(StatusCodes.OK).json({ returnUrl: returnUrl})
}

// Log out user
function logout(req, res) {
    res.clearCookie('user').redirect('/auth/login')
}

export { register, login, logout }

