import game from "./game.js";
import socket from "../socket.js";
import axios from '../axiosInstance.js'
import {activePlayerUpdate, createBoard, playersUpdate, cantJoin, endGame} from "./interface.js";

socket.on('checkerSelected', (coords) => {
    game.select_checker(coords)
    createBoard();
});

socket.on('gameOver', async (winner) => {
    let [color, userName] = winner
    console.log(`${userName} won! - listener`)
    endGame(color, userName)
});

socket.on('deleteRoom', async (room) => {
    try {
        await axios.delete(`/api/rooms/${room}`);
        console.log(`${room} deleted`)
    } catch (e) {
        console.error(`Error deleting room ${room}:`, e);
    }
})

socket.on('gameUpdate', curGame => {
    console.log("game update")
    game.gameStateUpdate(curGame)
    createBoard()
    activePlayerUpdate()
    if (game.is_game_over()) {
        socket.emit('gameOver')
    }
})

socket.on('playerEntered', () => {
    console.log("player entered")
    playersUpdate()
})

socket.on('cantEnter', username => {
    console.log(`${username} can't enter the game - maximum number od players - listener`)
    cantJoin()
})