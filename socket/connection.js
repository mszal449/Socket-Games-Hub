import Game from "../public/game/game-logic.js"
import cookie from 'cookie'
import cookieParser from "cookie-parser"
import {rooms} from '../routers/GameRouter.js'


function handleConnection(io) {
    const games = {} // active and waiting rooms

    io.on("connection", (socket) => {
        // get data from the request headers
        let link = socket.handshake.headers.referer
        let room = link.substring(link.length-5, link.length)
        const cookies = cookie.parse(socket.handshake.headers.cookie)
        const username = cookieParser.signedCookie(cookies.user, process.env.COOKIE_SECRET)
        if (room in rooms) {
            socket.join(room)
            if (!games[room]) {
                // Create a new game instance for the room if it doesn't exist
                games[room] = new Game()
            }

            const game = games[room]

            if (!([game.white_player, game.black_player].includes(username)) && !game.is_active()) {
                // Entering a game
                game.add_player(username)
            }
            if ([game.white_player, game.black_player].includes(username)) {
                // Entering a game OR refreshing screen
                io.to(room).emit('gameUpdate', game, room)
                io.to(room).emit('playerEntered')
            } else {
                // Can't enter the game - two players are already in
                socket.emit('cantEnter')
                socket.leave(room)
            }

            socket.on('gameOver', () => {
                let [winner, color] = game.get_winner()
                io.to(room).emit('gameOver', [winner, color])
                delete games[room]
                socket.emit('deleteRoom', room)
                socket.leave(room)
            })

            socket.on('selectChecker', (coords) => {
                if (username === game.active_player()) {
                    game.select_checker(coords)
                    socket.emit('checkerSelected', coords)
                }
            })

            socket.on('moveChecker', (path_and_coords) => {
                if (username === game.active_player()) {
                    game.validate_and_make_move(path_and_coords)
                    io.to(room).emit("gameUpdate", game)
                }
            })

            socket.on('disconnect', () => {
                socket.broadcast.to(room).emit('opponentDisconnected')
            })

            socket.on('endGameWalkover', () => {
                delete games[room]
                socket.emit('deleteRoom', room)
                socket.leave(room)
            })
        } else {
            socket.emit('redirect', '/game/dashboard')
        }
    })
}

export default handleConnection

