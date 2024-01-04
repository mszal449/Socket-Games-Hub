// class representing checkers game
// rules from: https://www.ultraboardgames.com/checkers/game-rules.php?utm_content=cmp-true


class Game {
    constructor() {
        // 0 - empty, 1 - white, 2 - black, 3 - white king, 4 - black king
        this.board = [
            // x = 0  1  2  3  4  5  6  7
            [0, 2, 0, 2, 0, 2, 0, 2],   // y = 0
            [2, 0, 2, 0, 2, 0, 2, 0],   // y = 1
            [0, 2, 0, 2, 0, 2, 0, 2],   // y = 2
            [0, 0, 0, 0, 0, 0, 0, 0],   // y = 3
            [0, 0, 0, 0, 0, 0, 0, 0],   // y = 4
            [1, 0, 1, 0, 1, 0, 1, 0],   // y = 5
            [0, 1, 0, 1, 0, 1, 0, 1],   // y = 6
            [1, 0, 1, 0, 1, 0, 1, 0]    // y = 7
        ]

        // current number of checkers
        this.white_checkers_num = 12
        this.black_checkers_num = 12

        // turn state
        this.white_turn = true
        this.capture_obligation = false
        this.selectedChecker = null

        // players
        this.white_player = null
        this.black_player = null
    }

    // ---------------- helper functions ----------------
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
        return this.white_turn ? 'white' : 'black'
    }

    active_player() {
        if (this.white_turn) {
            return this.white_player
        } else {
            return this.black_player
        }
    }

    is_king(x, y) {
        return this.board[y][x] > 2
    }

    is_active() {
        return ((this.black_player !== null) && (this.white_player !== null));
    }

    in_selected_checker_paths(x, y) {
        if (this.selectedChecker) {
            for (let path of this.selectedChecker.paths) {
                for (let target of path) {
                    if (target[0] === x && target[1] === y) {
                        return true
                    }
                }
            }
        }
        return false
    }

    // ---------------- updating state ----------------
    gameStateUpdate(newGameState) {
        this.board = newGameState.board

        this.white_checkers_num = newGameState.white_checkers_num
        this.black_checkers_num = newGameState.black_checkers_num

        this.white_turn = newGameState.white_turn
        this.capture_obligation = newGameState.capture_obligation
        this.selectedChecker = newGameState.selectedChecker

        this.white_player = newGameState.white_player
        this.black_player = newGameState.black_player
    }

    // ---------------- checking capture obligation logic ----------------

    check_capture_obligation(x, y, old_x, old_y, is_king) {
        let res = []; // list of available paths with capture for checker on [x, y]
        let yis = this.white_turn ? [-1] : [1];

        if (is_king) {
            yis = [-1, 1]; // for kings, we need to check backwards
        }

        ([-1, 1]).forEach(xi => {
            (yis).forEach(yi => {
                if (
                    this.in_board_bounds(x + xi, y + yi) &&
                    this.in_board_bounds(x + 2 * xi, y + 2 * yi) &&
                    this.is_opposite_color(x + xi, y + yi) &&
                    this.is_empty(x + 2 * xi, y + 2 * yi) &&
                    ((old_x !== x + 2 * xi) || (old_y !== y + 2 * yi))
                ) {
                    let new_arr = this.check_capture_obligation(x + 2 * xi, y + 2 * yi, x, y, is_king);
                    if (new_arr.length === 0) {
                        // no more captures available, end path with current square
                        res.push([[x + 2 * xi, y + 2 * yi]]);
                    } else {
                        // add current square to path
                        new_arr.forEach(path => {
                            path.unshift([x + 2 * xi, y + 2 * yi]);
                            res.push(path);
                        });
                    }
                }
            });
        });
        return res;
    }


    // function checking capture obligation for every active checker
    // returns list of checkers that can capture and lists from check_capture_obligation for them
    check_capture_obligation_for_all() {
        let res = [];   //  it will be the list of possible moves with capture
        ([...Array(8).keys()]).forEach(y => {
            ([...Array(8).keys()].filter(x => x % 2 !== y % 2)).forEach(x => {
                if (this.is_active_color(x, y)) {
                    let path = this.check_capture_obligation(x, y, -1, -1, this.is_king(x, y))
                    if (path.length > 0) {
                        res.push({
                            checker: [x, y],    // coordinates of checker that can capture
                            paths: path      // possible coordinates to go for it
                        })
                    }
                }
            })
        })
        return res
    }

    // ---------------- getting list of possible moves without capture ----------------
    get_available_moves(x, y) {
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
            paths: [res]
        };
    }

    get_available_moves_for_all() {
        let res = [];
        ([...Array(8).keys()]).forEach(y => {
            ([...Array(8).keys()].filter(x => x % 2 !== y % 2)).forEach(x => {
                if (this.is_active_color(x, y)) {
                    res.push(this.get_available_moves(x, y))
                }
            })
        })
        return res
    }

    // ---------------- moves validation ----------------
    move_validation_start(coords, moves_list) {
        let old_x, old_y
        [old_x, old_y] = coords;

        for (let move of moves_list) {
            if (move.checker[0] === old_x && move.checker[1] === old_y) {
                return move;
            }
        }
        return false;
    }

    move_validation_target(coords, moves_paths) {
        let new_x, new_y
        [new_x, new_y] = coords;

        for (let path of moves_paths) {
            for (let i = 0; i < path.length; i++) {
                if (path[i][0] === new_x && path[i][1] === new_y) {
                    return [path, i];
                }
            }
        }
        return false;
    }

    // ---------------- making moves on board ----------------

    make_moves(path, target_index) {
        for (let move of path.slice(0, target_index+1)) {
            let [old_x, old_y] = this.selectedChecker.checker;
            let [new_x, new_y] = move;

            // moving checker
            let checker = this.board[old_y][old_x]
            this.board[old_y][old_x] = 0

            // upgrade checker to king
            if ((checker <= 2) && (new_y === 0 || new_y === 7)) {
                checker += 2
            }
            this.board[new_y][new_x] = checker

            // capturing opponent's checker
            if (this.capture_obligation) {
                this.board[(old_y + new_y) / 2][(old_x + new_x) / 2] = 0
                this.white_turn ? this.black_checkers_num-- : this.white_checkers_num--
            }

            this.selectedChecker.checker = [new_x, new_y]
        }
    }

    // ---------------- game ending ----------------
    is_game_over() {
        return (this.white_checkers_num === 0 || this.black_checkers_num === 0)
    }

    get_winner() {
        return (this.black_checkers_num === 0 ? ["white", this.white_player] : ["black", this.black_player])
    }

    // ---------------- starting game ----------------
    add_player(user) {
        if (this.white_player === null) {
            this.white_player = user
        } else if (this.black_player === null) {
            this.black_player = user
        }
    }

    // ---------------- whole game logic ----------------

    end_turn() {
        this.selectedChecker = null
        this.capture_obligation = false
        this.white_turn = !this.white_turn
    }

    select_checker(coords) {
        let all_possible_moves = this.check_capture_obligation_for_all()

        if (all_possible_moves.length === 0) {
            all_possible_moves = this.get_available_moves_for_all()
        } else {
            this.capture_obligation = true
        }

        // validate chosen checker
        let move_object = this.move_validation_start(coords, all_possible_moves)
        if (move_object !== false) {
            this.selectedChecker = move_object
        }
    }

    validate_and_make_move(path_and_coords) {
        let [path, target_index] = path_and_coords
        this.make_moves(path, target_index)
        this.end_turn()
    }
}
export default Game;