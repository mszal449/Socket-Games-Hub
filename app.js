// Environmental variables configuration
require('dotenv').config()


// Express app setup
const express = require('express')
const app = express()


// Setup basic route
app.get('/', (req, res) => {
    res.status(200).send('Socket-Game-Hub')
})


// Load port from .env
const port = process.env.PORT || 3000

const start = async () => {
    try {
        app.listen(port, ()=> {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (err){
        console.log(err)
    }
}

start()