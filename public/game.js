import Game from "./game-logic.js";

const socket = io('ws://localhost:3000')

let game = new Game();
const board = document.getElementById('board');

function createBoard() {
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

// Function to handle cell clicks
function getInput(x, y) {
    game.next_step([x, y]);
    // updating after every click
    board.textContent = '';
    createBoard();
}

createBoard();