import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'

// Register user
const register = async (req, res) => {
    const { username, password1, password2 } = req.body

    // Check if all fields are filled out
    if (!username || !password1 || !password2) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'All fields are required' })
    }

    // Check if username is taken
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

    // Generate authentication token
    const token = user.createJWT()

    // Save token inside of a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

    // Redirect to the dashboard page
    res.status(StatusCodes.CREATED)
        .redirect('/main/dashboard')
}

// Login an existing user
const login = async (req, res) => {
    const { username, password } = req.body

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

    // Generate token
    const token = user.createJWT()
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(StatusCodes.OK)
        .json({ user: { username: user.username }, token })
}

// Log out user
const logout = (req, res) => {
    // Try deleting the authentication token and redirect to login page
    try {
        res.clearCookie('token')
        res.status(StatusCodes.OK).redirect('/auth/login')
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).redirect('/auth/login')
    }
}


export { register, login, logout }

