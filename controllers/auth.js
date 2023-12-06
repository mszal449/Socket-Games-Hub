const User = require('../models/user');
const { StatusCodes } = require('http-status-codes')
const { UnauthenticatedError, BadRequestError } = require('../errors')

// Register user
const register = async (req, res) => {
    // Create new user record in database
    const user = await User.create({ ...req.body})

    // Generate authentication token
    const token = user.createJWT()

    // Respond with user data and token
    res.status(StatusCodes.CREATED).json({ user: {username: user.username}, token})
}

// Login existing user
const login = async (req, res) => {
    const { username, password } = req.body

    // Check if username and password are given
    if (!username || !password) {
        throw new BadRequestError('Please provide username and password')
    }

    // Check if user exists
    const user = await User.findOne({ username })
    if (!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    // Validate password
    const isPasswordCorrect = await user.comparePasswords(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    // Generate token
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user:{ username: user.username}, token })
}


module.exports = {
    register,
    login,
}