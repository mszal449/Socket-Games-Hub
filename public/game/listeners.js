import game from "./game.js";
import socket from "./socket.js";
import {activePlayerUpdate, createBoard, playersUpdate} from "./interface.js";

socket.on('checkerSelected', (coords) => {
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

socket.on('cantEnter', username => {
    console.log(`${username} can't enter the game - maximum number od players - listener`)
})