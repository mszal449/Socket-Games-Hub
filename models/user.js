import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// User model
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'This username already exists'],
        required: [true, 'Please provide username'],
        minlength: 3,
        maxlength: 50,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
    },
})

// Encrypt password on user creation
UserSchema.pre('save', async function (next) {
    // Generate password salt
    const salt = await bcrypt.genSalt(10)
    // Hash password
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Create a token for user authentication
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, username: this.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )
}

// Validate given password
UserSchema.methods.comparePasswords = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

// Export model
const User = mongoose.model('User', UserSchema)
export default User
