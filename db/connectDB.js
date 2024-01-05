import mongoose from 'mongoose'

// Connect to the database
function connectDB(url) {
    mongoose.connect(url, {})
}

export default connectDB
