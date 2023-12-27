import Game from "../public/game/game-logic.js";
import cookie from 'cookie'
import cookieParser from "cookie-parser";

const handleConnection = (io) => {
    let game = new Game();

    io.on("connection", (socket) => {
        // Parse cookies from the request headers
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        const username = cookieParser.signedCookie(cookies.user, process.env.COOKIE_SECRET);

        if (!([game.white_player, game.black_player].includes(username)) && !game.is_active()) {
            // entering a game
            game.add_player(username)
        } if ([game.white_player, game.black_player].includes(username)) {
            // entering a game OR refreshing screen
            io.emit('gameUpdate', game)
            io.emit('playerEntered')
        } else {
            // cant enter the game - two players are already in
            socket.emit('cantEnter', username)
        }

        socket.on('gameOver', () => {
            console.log('end game - server')
            io.emit('gameOver');
        });

        socket.on('selectChecker', (coords) => {
            if (username === game.active_player()) {
                game.select_checker(coords)
                socket.emit('checkerSelected', coords)
            }
        });

        socket.on('moveChecker', (path_and_coords) => {
            if (username === game.active_player()) {
                game.validate_and_make_move(path_and_coords)
                io.emit("gameUpdate", game)
            }
        })
    });
};

export default handleConnection;