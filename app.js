// Environmental variables configuration
import dotenv from 'dotenv'
dotenv.config()

// Express app setup
import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import nunjucks from 'nunjucks'

// Serve static files from the public directory
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))

// Specify the path to your templates
const templatePath = './public/views'

// Create a Nunjucks environment
const env = nunjucks.configure(templatePath, {
    autoescape: true,
    express: app,
})

// App configuration
app.use(express.json())

// Load port from .env
const port = process.env.PORT || 3000

app.get("/game", (req, res) => {
    res.render("game.html", {})
})

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
            console.log(`link: http://localhost:${port}/game`)
        });
    } catch (err) {
        console.log(err)
    }
};

start()