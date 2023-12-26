import game from "./game.js";
import socket from "./socket.js";

export function getInput(x, y) {
    if (game.is_game_over()) {
        // todo: wywalić console logi
        console.log(`${game.get_winner()} won!`)
        socket.emit('gameOver')
    } else if (game.selectedChecker === null) {
        // todo: wywalić console logi
        console.log(`selected checker ${x}, ${y} - getInput`)
        socket.emit('selectChecker', [x, y])
    } else {
        let validation = game.move_validation_target([x, y], game.selectedChecker.paths)
        if (validation) {
            // todo: wywalić console logi
            let [path, target_index] = validation
            console.log(`move checker from ${x}, ${y} to ${path[target_index]} - getInput`)
            //
            socket.emit('moveChecker', validation)
        } else if (game.is_active_color(x, y)) {
            // todo: wywalić console logi
            console.log(`selected checker ${x}, ${y} - getInput`)
            socket.emit('selectChecker', [x, y])
        }
    }
}