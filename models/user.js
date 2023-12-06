const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// User model
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        minlength: 5,
        maxlength: 50,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    }
})

// Encrypt password on user creation
UserSchema.pre('save', async function(next) {
    // Generate password salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Create a token for user authentication
UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {userId: this._id, name: this.username},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    )
}

// Validate password
UserSchema.methods.comparePasswords = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User
