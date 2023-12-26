import game from "./game.js";
import socket from "./socket.js";
import {activePlayerUpdate, createBoard, playersUpdate} from "./interface.js";

socket.on('checkerSelected', (coords) => {
    console.log(`checkerSelected ${coords[0]}, ${coords[1]} - listener`)
    game.select_checker(coords)
    createBoard();
});

socket.on('gameOver', () => {
    console.log(`${game.get_winner()} won! - listener`)
});


socket.on('gameUpdate', curGame => {
    game.gameStateUpdate(curGame)
    createBoard()
    activePlayerUpdate()
})

socket.on('playerEntered', () => {
  playersUpdate()
})