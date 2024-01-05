import game from "./game.js"
import socket from "../socket.js"

export function getInput(x, y) {
    if (game.selectedChecker === null) {
        // selecting checker
        socket.emit('selectChecker', [x, y])
    } else {
        let validation = game.move_validation_target([x, y], game.selectedChecker.paths)
        if (validation) {
            // moving checker
            socket.emit('moveChecker', validation)
        } else if (game.is_active_color(x, y)) {
            // selecting different checker
            socket.emit('selectChecker', [x, y])
        }
    }
}