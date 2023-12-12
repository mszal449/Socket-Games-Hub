import mongoose from 'mongoose'

// Connect to the database
const connectDB = (url) => {
    mongoose.connect(url, {})
}

export default connectDB
