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
import gameRouter from './routers/gameRouter.js'
import auth from './middleware/authentication.js'
import handleConnection from "./socket/connection.js";

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


// Load port from .env
const port = process.env.PORT || 3000

// Start server

// -------------------------------- problem jest tu --------------------------------
// próbuję trzymać listę aktywnych pokoi na serwerze tzn. tych, w których ktoś jest i czeka na drugiego gracza
// i tych, w których już grają dwie osoby. Potrzebuję je wyświetlać w dashboardzie.
// No i generalnie próbuję je trzymać na serwerze, żeby mieć do nich dostęp w dashboardzie bez łączenia się do socketa.
// W sensie wiem, że to aktualnie idzie w stronę syfu i spaghetti ale raczej będe wiedziała, jak to odkręcić jak zadziała.
// tak czy siak mam taki endpoint, który działa, normalnie mogę sobie wyświetlić.
let rooms = {}
app.post('/api/rooms', (req, res) => {
    const room = req.body;
    res.json({ roomId: room.roomId, waiting: room.waiting });
});
app.get('/api/rooms', (req, res) => {
    res.json(Object.keys(rooms));
});
// ---------------------------------------------------------------------------

const server = app.listen(port, () => {
    console.log(`listening on http://localhost:${port}/auth/login`);
});

const io = new Server(server);

// Function to connect to the database
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to the database');
    } catch (err) {
        console.log(err);
    }
};

// Initiating the database connection
start();

// Handling socket connections
handleConnection(io);
