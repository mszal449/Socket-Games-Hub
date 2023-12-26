import game from "./game.js";
import socket from "./socket.js";
import {activePlayerUpdate, createBoard} from "./interface.js";

socket.on('checkerSelected', (coords) => {
    console.log(`checkerSelected ${coords[0]}, ${coords[1]} - listener`)
    game.select_checker(coords)
    createBoard();
});

socket.on('moveDone', (path_and_coords) => {
    // todo: wywalić console logi
    let [path, target_index] = path_and_coords
    console.log(`move checker from ${game.selectedChecker['checker'][0]}, ${game.selectedChecker['checker'][1]} to ${path[target_index]} - listener`)
    //
    game.validate_and_make_move(path_and_coords)
    createBoard()
    activePlayerUpdate()
});

socket.on('gameOver', () => {
    console.log(`${game.get_winner()} won! - listener`)
});


socket.on('gameUpdate', curGame => {
    game.gameStateUpdate(curGame)
    createBoard()
    activePlayerUpdate()
})