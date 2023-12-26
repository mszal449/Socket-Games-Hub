import Game from "../public/game/game-logic.js";
import cookie from 'cookie'
import cookieParser from "cookie-parser";

const handleConnection = (io) => {
    let game = new Game();

    io.on("connection", (socket) => {
        // Parse cookies from the request headers
        var cookies = cookie.parse(socket.handshake.headers.cookie)
        let user = cookies.user
        var extractedUsername = cookieParser.signedCookie(user, process.env.COOKIE_SECRET)

        console.log(`A user ${extractedUsername} connected to ` + socket.id);

        if (!game.is_active()) {
            if (game.white_player !== user) {
                console.log(`A user ${user} enter game`);
                game.add_player(user)
            }
            io.emit("playerEntered")
            io.emit('gameUpdate', game)
        } else {
            console.log("Maximum number of players in this game, sorry")
        }

        socket.on('gameOver', () => {
            console.log('end game - server')
            io.emit('gameOver');
        });

        socket.on('selectChecker', (coords) => {
            // todo: wywalić console logi
            console.log(`selected checker ${coords[0]}, ${coords[1]} - server`)
            //
            game.select_checker(coords)
            socket.emit('checkerSelected', coords)
        });

        socket.on('moveChecker', (path_and_coords) => {
            // todo: wywalić console logi
            let [path, target_index] = path_and_coords
            console.log(`move checker from ${game.selectedChecker['checker'][0]}, ${game.selectedChecker['checker'][1]} to ${path[target_index]} - server`)
            //
            game.validate_and_make_move(path_and_coords)
            io.emit("gameUpdate", game)
        })
    });
};

export default handleConnection;