import express from 'express'
import auth from '../middleware/authentication.js'
const router = express.Router()
let rooms = {}

// Dashboard route - room management view
router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard.html', { user: req.user, 'title': 'Dashboard'})
})

// Checkers route
router.get("/checkers", auth, (req, res) => {
    res.render("game.html", { user: req.user, 'title': 'Checkers'})
})

// Create a room
router.post('/rooms', (req, res) => {
    const room = req.body
    rooms[room.roomId] = room.waiting
    res.json({ roomId: room.roomId, waiting: room.waiting })
})

// Return rooms data
router.get('/rooms', (req, res) => {
    res.json(rooms)
})

// Update rooms id
router.patch('/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId
    if (rooms.hasOwnProperty(roomId)) {
        rooms[roomId] = false
        res.status(200).json({ message: `Room ${roomId} status updated` })
    } else {
        res.status(404).json({ error: `Room ${roomId} not found` })
    }
})

// Delete room
router.delete('/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId
    if (rooms.hasOwnProperty(roomId)) {
        delete rooms[roomId] // Delete the room from the roomsData object
        res.status(200).json({ message: `Room ${roomId} deleted` })
    } else {
        res.status(404).json({ error: `Room ${roomId} not found` })
    }
})


export {router, rooms}
