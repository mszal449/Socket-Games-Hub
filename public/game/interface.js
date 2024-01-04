import game from "./game.js"
import {getInput} from "./getInput.js";

const board = document.getElementById('board');
const activeColor = document.getElementById('activePlayer');
const white = document.getElementById('p_white');
const black = document.getElementById('p_black');

export function createBoard() {
    board.textContent = ''
    for (let i = 0; i < game.board.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < game.board[i].length; j++) {
            const cell = document.createElement('td');
            cell.classList.add(`color-${game.board[i][j] === 0? 2 : game.board[i][j]%2}`);
            if (game.selectedChecker
                && game.selectedChecker.checker[0] === j
                && game.selectedChecker.checker[1] === i) {
                cell.classList.add('selected');

            } else if (game.in_selected_checker_paths(j, i)) {
                cell.classList.add('target');
            } else {
                cell.classList.add(`background-${(i+j)%2}`);
            }
            cell.textContent = game.board[i][j];
            cell.addEventListener('click', () => getInput(j, i));
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

export function activePlayerUpdate() {
    activeColor.textContent = `${game.active_color_string()} turn!`
}

export function playersUpdate() {
    let wait_str = "waiting for player..."
    white.textContent = `white: ${game.white_player || wait_str}`
    black.textContent = `black: ${game.black_player || wait_str}`
}

export function cantJoin() {
    board.textContent = "Can't join this game - two players already in"
}

export function endGame(color, userName) {
    board.textContent = `Game ended: the winner is ${userName} (${color})`
}

export function walkoverVictory() {
    board.textContent = `Your opponent left game - at least you won, didn't you? :)`
}
