// Environmental variables configuration
import dotenv from 'dotenv'
dotenv.config()

// App configuration imports
import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import nunjucks from 'nunjucks'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Project imports
import connectDB from './db/connectDB.js'
import authRouter from './routers/authRouter.js'
import mainRouter from './routers/mainRouter.js'

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
app.use(cookieParser())


// Routes
app.use('/main', mainRouter)
app.use('/auth', authRouter)

// Load port from .env
const port = process.env.PORT || 3000

// Start server
app.get("/game", (req, res) => {
    res.render("game.html", {})
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to the database')
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()