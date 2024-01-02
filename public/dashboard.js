const new_game_btn = document.getElementById('new_game_btn');

function createRoom() {

    function generateRoomId() {
        return (Math.floor(Math.random() * 1000000)).toString();
    }

    let roomId = generateRoomId()
    window.location.href = `/game/checkers?room=${roomId}`;

}

function enterRoom(roomId) {}

new_game_btn.addEventListener('click', createRoom)