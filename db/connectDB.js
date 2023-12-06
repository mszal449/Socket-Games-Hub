const mongoose = require('mongoose')

// Connect to database
const connectDB = (url) => {
    const mongoose = require('mongoose');
    mongoose.connect(url, {});

}

module.exports = connectDB
