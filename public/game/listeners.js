import game from "./game.js";
import socket from "../socket.js";
import axios from '../axiosInstance.js'
import {activePlayerUpdate, createBoard, playersUpdate, cantJoin, endGame, walkoverVictory} from "./interface.js";

socket.on('checkerSelected', (coords) => {
    game.select_checker(coords)
    createBoard();
});

socket.on('gameOver', async (winner) => {
    let [color, userName] = winner
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
    game.gameStateUpdate(curGame)
    createBoard()
    activePlayerUpdate()
    if (game.is_game_over()) {
        socket.emit('gameOver')
    }
})

socket.on('playerEntered', () => {
    playersUpdate()
})

socket.on('cantEnter', () => {
    cantJoin()
})

let reconnectionReceived = false; // for handling reconnection in 5 seconds

socket.on('opponentDisconnected', () => {
    reconnectionReceived = false
    const timeout = setTimeout(() => {
        // if opponent didn't reconnect in 5 seconds
        socket.emit('endGameWalkover')
        walkoverVictory()
    }, 5000)
    socket.on('playerEntered', () => {
        // if opponent reconnected
        reconnectionReceived = true;
        clearTimeout(timeout);
    });
})