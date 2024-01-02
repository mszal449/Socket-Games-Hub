const new_game_btn = document.getElementById('new_game_btn');
const roomList = document.getElementById('roomList');

// tym się nie przejmuj, ta funkcja działa elegancko
function addRoomCard(roomId, waiting) {

    // Create card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';

    // Create card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create card title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = "#"+roomId;

    // Create card subtitle
    const cardSubtitle = document.createElement('h6');
    cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
    cardSubtitle.textContent = 'Play checkers online!';

    // Append elements to the card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);

    // Create 'Play' button if room is waiting
    if (waiting) {
        const playButton = document.createElement('a');
        playButton.href = `/game/checkers?room=${roomId}`;
        playButton.classList.add('btn', 'btn-primary');
        playButton.textContent = 'Play';
        cardBody.appendChild(playButton);
    }

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to the room list
    roomList.appendChild(card);
}

// -------------------------------- problem jest tu --------------------------------
function createRoom() {
    // plz nie komentuj, że te numery są losowe i mogą się powtórzyć XD
    // jak dostanę dostęp do listy pokojów, to im nie pozwolę
    function generateRoomId() {
        return (Math.floor(Math.random() * 1000000)).toString();
    }

    const roomId = generateRoomId();

    // coś z tym postem jest źle, bo te pokoje się nie dodają nigdzie
    fetch('/api/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: roomId, waiting: true }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Room created:', data);  // to normalnie zwraca dane pokoju
            // addRoomCard(data.roomId, true);  //  to zadziała, jak odkomentuję
            getRoomsList();  // NO A TO NIE DZIAŁA
            // window.location.href = `/game/checkers?room=${data.roomId}`;  // to też na luzie
        })
        .catch(error => console.error('Błąd podczas tworzenia pokoju:', error));
}

function getRoomsList() {
    // ogólnie jak sobie wchodziłam w to api/rooms na przeglądarce, to było puste:( więc się chyba nie dodają
    fetch('/api/rooms', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(`fetched ${data.length} rooms`); // A TO MI CIĄGLE ZWRACA, ŻE JEST 0 POKOI
            data.forEach(room => {
                // więc jak nietrudno się domyślić, tu się nic nie dzieje
                console.log(room);
                addRoomCard(room.roomId, room.waiting)
            });
        })
        .catch(error => console.error('Błąd podczas tworzenia listy pokojów:', error));
}
// -------------------------------------------------------------------------------

new_game_btn.addEventListener('click', createRoom)
getRoomsList()
