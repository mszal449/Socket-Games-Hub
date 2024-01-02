import Game from "../public/game/game-logic.js";
import cookie from 'cookie';
import cookieParser from "cookie-parser";

const handleConnection = (io) => {
    const games = {}; // Object to store multiple game instances based on room ids

    io.on("connection", (socket) => {
        // Parse cookies from the request headers
        let link = socket.handshake.headers.referer
        let room = link.substring(link.length-6, link.length)
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        const username = cookieParser.signedCookie(cookies.user, process.env.COOKIE_SECRET);
        console.log(`User ${username} on socket ${socket.id} joined room ${room}`);

        socket.join(room);
        if (!games[room]) {
            // Create a new game instance for the room if it doesn't exist
            games[room] = new Game();
        }

        const game = games[room];

        if (!([game.white_player, game.black_player].includes(username)) && !game.is_active()) {
            // Entering a game
            game.add_player(username);
        }
        if ([game.white_player, game.black_player].includes(username)) {
            // Entering a game OR refreshing screen
            io.to(room).emit('gameUpdate', game);
            io.to(room).emit('playerEntered');
        } else {
            // Can't enter the game - two players are already in
            socket.emit('cantEnter', username);
        }

        socket.on('gameOver', () => {
            console.log('end game - server');
            io.to(room).emit('gameOver');
            delete games[room]
        });

        socket.on('selectChecker', (coords) => {
            if (username === game.active_player()) {
                game.select_checker(coords);
                socket.emit('checkerSelected', coords);
            }
        });

        socket.on('moveChecker', (path_and_coords) => {
            if (username === game.active_player()) {
                game.validate_and_make_move(path_and_coords);
                io.to(room).emit("gameUpdate", game);
            }
        });
    });
};

export default handleConnection;

