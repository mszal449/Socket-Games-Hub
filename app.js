// Environmental variables configuration
import dotenv from 'dotenv'
dotenv.config()

// App configuration imports
import express from 'express'
import { fileURLToPath } from 'url'
import {Server} from 'socket.io'
import path from 'path'
import nunjucks from 'nunjucks'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Project imports
import connectDB from './db/connectDB.js'
import authRouter from './routers/authRouter.js'
import {router as gameRouter} from './routers/GameRouter.js'
import auth from './middleware/authentication.js'
import handleConnection from "./socket/connection.js"


// Serve static files from the public directory
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))

// Specify the path to your templates
const templatePath = './public/views'

// Create a Nunjucks environment
nunjucks.configure(templatePath, {
    autoescape: true,
    express: app,
})

// App configuration
app.use(express.json())
app.use(cors())
app.use(cookieParser(process.env.COOKIE_SECRET))


// Routes
app.use('/game', auth, gameRouter)
app.use('/auth', authRouter)
app.get('*', (req, res) => {
    res.status(300).redirect('/auth/login')
})

// Load port from .env
const port = process.env.PORT || 3000

// Start server
const server = app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})

const io = new Server(server)

// Function to connect to the database
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connected to the database')
    } catch (err) {
        console.log(err)
    }
}

// Initiating the database connection
start()

// Handling socket connections
handleConnection(io)
