import Game from "../public/game/game-logic.js";

const handleConnection = (io) => {
    let game = new Game();

    io.on("connection", (socket) => {
        console.log("A user connected to " + socket.id);
        io.emit("gameUpdate", game)

        socket.on('gameOver', () => {
            console.log('koniec gry - serwer')
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
            socket.emit('moveDone', path_and_coords)
            socket.broadcast.emit("gameUpdate", game)
        })
    });
};

export default handleConnection;