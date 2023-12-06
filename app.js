// Environmental variables configuration
require('dotenv').config()


// Express app setup
const express = require('express')
const app = express()



// imports
const connectDB = require('./db/connectDB')
const authRouter = require('./routers/authRouter');

// app configuration
app.use(express.json())


// Routes

app.use('/auth', authRouter)


// Load port from .env
const port = process.env.PORT || 3000

const start = async () => {
    try {
        connectDB(process.env.MONGO_URI)
        console.log('Connected to the database')
        app.listen(port, ()=> {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (err){
        console.log(err)
    }
}

start()