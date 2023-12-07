// class representing checkers game
// rules from: https://www.ultraboardgames.com/checkers/game-rules.php?utm_content=cmp-true
// todo: tę planszę się powinno odwrócić w widoku, żeby pionki gracza zawsze były na dole...

class Game {
    constructor() {
        this.white_turn = true
        this.board = [      // 0 - empty, 1 - white, 2 - black, 3 - white king, 4 - black king
      // x = 0  1  2  3  4  5  6  7
            [0, 2, 0, 2, 0, 2, 0, 2],   // y = 0
            [2, 0, 2, 0, 2, 0, 2, 0],   // y = 1
            [0, 2, 0, 2, 0, 2, 0, 2],   // y = 2
            [0, 0, 1, 0, 0, 0, 0, 0],   // y = 3
            [0, 0, 0, 0, 0, 0, 0, 0],   // y = 4
            [1, 0, 1, 0, 1, 0, 1, 0],   // y = 5
            [0, 1, 0, 0, 0, 1, 0, 1],   // y = 6
            [1, 0, 1, 0, 1, 0, 1, 0]    // y = 7
        ]
        this.white_checkers_num = 12
        this.black_checkers_num = 12
    }

    is_opposite_color(x, y) {
        let colors = this.white_turn ? [2, 4] : [1, 3]
        return colors.includes(this.board[y][x])
    }

    is_active_color(x, y) {
        let colors = this.white_turn ? [1, 3] : [2, 4]
        return colors.includes(this.board[y][x])
    }

    is_empty(x, y) {
        return this.board[y][x] === 0
    }

    in_board_bounds(x, y) {
        return (x >= 0 && x < 8 && y >= 0 && y < 8)
    }

    active_color_string() {
        return this.white_turn? 'white' : 'black'
    }

    is_king(x, y) {
        return this.board[y][x] > 2
    }

    // ---------------- checking capture obligation logic ----------------
    // checking capture obligation - returns list of (possibly) multiple jumps
    check_capture_obligation(x, y) {
        let res = [];
        let yis;
        if (this.is_king(x, y)) {
            yis = [-1, 1]
        } else {
            yis = this.white_turn ? [-1] : [1]
        }
        ([-1, 1]).forEach(xi => {
            (yis).forEach(yi => {
                if (this.in_board_bounds(x + xi, y + yi) && this.in_board_bounds(x + 2 * xi, y + 2 * yi)) {
                    if (this.is_opposite_color(x + xi, y + yi) && this.is_empty(x + 2 * xi, y + 2 * yi)) {
                        let new_arr = this.check_capture_obligation(x + 2 * xi, y + 2 * yi);
                        new_arr.unshift([x + 2 * xi, y + 2 * yi]);
                        res = res.concat(new_arr);
                    }
                }
            })
        });
        return res;
    }

    // function checking capture obligation for every active checker
    // returns list of checkers that can capture and lists from check_capture_obligation for them
    check_capture_obligation_for_all() {
        let res = [];
        ([...Array(8).keys()]).forEach(y => {
            ([...Array(8).keys()].filter(x => x%2 !== y%2)).forEach(x => {
                if (this.is_active_color(x, y)) {
                    let jumps = this.check_capture_obligation(x, y)
                    if (jumps.length > 0) {
                        res.push({
                            checker: [x, y],    // coordinates of checker that can capture
                            ends: jumps         // possible coordinates to go for it
                        })
                    }
                }
            })
        })
        return res
    }

    // ---------------- getting list of possible moves without capture ----------------
    get_possible_moves(x, y) {
        let res = [];
        let yis;
        if (this.is_king(x, y)) {
            yis = [-1, 1]
        } else {
            yis = this.white_turn ? [-1] : [1]
        }
        ([-1, 1]).forEach(xi => {
            (yis).forEach(yi => {
                if (this.in_board_bounds(x + xi, y + yi) && this.is_empty(x + xi, y + yi)) {
                    res.push([x + xi, y + yi])
                }
            })
        });
        return {
            checker: [x, y],
            ends: res
        };
    }

    get_possible_moves_for_all() {
        let res = [];
        ([...Array(8).keys()]).forEach(y => {
            ([...Array(8).keys()].filter(x => x%2 !== y%2)).forEach(x => {
                if (this.is_active_color(x, y)) {
                    res.push(this.get_possible_moves(x, y))
                }
            })
        })
        return res
    }


    // ---------------- getting input ----------------
    // todo: tu będzie kompletnie coś innego jak zmienię to na wersję serwerową z konsolowej - póki co śmieci

    get_input() {
        const text = this.white_turn ? "Lights' turn\n" : "Darks' turn\n"
        const x1 = parseInt(prompt(`${text}enter x coordinate of chosen checker:`));
        const y1 = parseInt(prompt(`${text}enter y coordinate of chosen checker:`));
        const x2 = parseInt(prompt(`${text}enter x coordinate of move destination:`));
        const y2 = parseInt(prompt(`${text}enter y coordinate of move destination:`));

        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            throw new Error('Invalid input: not a number');
        }

        return [x1, y1, x2, y2];
    }

    print_available_moves(moves_list) {  // todo - do śmieci
        moves_list.forEach(move => {
            if (move.ends.length !== 0) {
                console.log(`for checker: ${move.checker}`)
                console.log(`you can go to ${JSON.stringify(move.ends)}`)
            }
        })
    }

    // ---------------- moves validation ----------------
    // checker move from (old_x, old_y) to (new_x, new_y) with capture

    move_validation(coords, moves_list) {
        let old_x, old_y, new_x, new_y;
        [old_x, old_y, new_x, new_y] = coords;

        for (let move of moves_list) {
            if (move.checker[0] === old_x && move.checker[1] === old_y) {
                for (let end of move.ends) {
                    if (end[0] === new_x && end[1] === new_y) {
                        return true;
                    }
                }
                console.log("choose destination square available for chosen checker");
            } else {
                console.log("choose your checker");
            }
        }
        return false;
    }

    // ---------------- making moves on board ----------------

    make_move(coords, with_capture) {
        let old_x, old_y, new_x, new_y;
        [old_x, old_y, new_x, new_y] = coords;
        let checker = this.board[old_y][old_x]
        this.board[old_y][old_x] = 0

        // changing type of checker to king
        if ((checker <= 2) && (new_y === 0 || new_y === 7)) {
            checker += 2
        }
        this.board[new_y][new_x] = checker

        // capturing opponent's checker
        if (with_capture) {
            this.board[(old_y + new_y) / 2][(old_x + new_x) / 2] = 0
            this.white_turn ? this.black_checkers_num-- : this.white_checkers_num--
        }

        console.log(`moved from ${JSON.stringify([old_x, old_y])} to ${JSON.stringify([new_x, new_y])}`)
    }

    // ---------------- game ending ----------------
    is_game_over() {
        return (this.white_checkers_num === 0 || this.black_checkers_num === 0)
    }

    get_winner() {
        return (this.white_checkers_num === 0? "white" : "black")
    }

    // ---------------- whole game logic ----------------
    // process of single turn
    async turn() {
        console.log(`${this.active_color_string()} turn`)
        console.log(`white: ${this.white_checkers_num} | black: ${this.black_checkers_num}`)
        let with_capture = true

        await new Promise(resolve => setTimeout(resolve, 100));
        try {

            // moves - list of possible moves in current turn for active player
            let possible_moves = this.check_capture_obligation_for_all()
            if (possible_moves.length === 0) {
                possible_moves = this.get_possible_moves_for_all()
                with_capture = false
            }
            this.print_available_moves(possible_moves)
            let coords = this.get_input();

            // check if chosen move is possible
            while (!this.move_validation(coords, possible_moves)) {
                coords = this.get_input();
            }

            // making a move
            if (!with_capture) {
                this.make_move(coords, false)
            } else {
                // while capturing, we can make multiple moves in one turn
                let old_x, old_y, new_x, new_y;
                [old_x, old_y, new_x, new_y] = coords;
                // possible moves for chosen checker
                let moves_for_checker =
                    possible_moves.filter(move => (move.checker[0] === old_x && move.checker[1] === old_y))[0].ends
                // creating list of moves to be done (because only one capture is obligatory, not all possible)
                let coords_id = -1;
                for (let i = 0; i < moves_for_checker.length; i++) {
                    if ((moves_for_checker[i][0] === new_x) && (moves_for_checker[i][1] === new_y)) {
                        coords_id = i;
                    }
                }
                let multiple_moves = moves_for_checker.slice(0, coords_id + 1);
                // making moves from list
                for (let move of multiple_moves) {
                    this.make_move([old_x, old_y, move[0], move[1]], true)
                    old_x = move[0];
                    old_y = move[1];
                }
            }

            this.white_turn = !this.white_turn
        } catch (e) {
            console.error(e.message);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.turn();
        }
    }

    // whole game as a function
    async game_loop() {
        while (!this.is_game_over()) {
            await this.turn.call(this);
            console.table(this.board);
        }
        return this.get_winner();
    }
}

export default Game;
