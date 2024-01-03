import axios from './axiosInstance.js'
const new_game_btn = document.getElementById('new_game_btn')
const roomList = document.getElementById('roomList')

// tym się nie przejmuj, ta funkcja działa elegancko
function addRoomCard(roomId, waiting) {

    // Create card element
    const card = document.createElement('div')
    card.classList.add('card')
    card.style.width = '18rem'

    // Create card body
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    // Create card title
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = "#"+roomId

    // Create card subtitle
    const cardSubtitle = document.createElement('h6')
    cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-body-secondary')
    cardSubtitle.textContent = 'Play checkers online!'

    // Append elements to the card body
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardSubtitle)

    // Create 'Play' button if room is waiting
    if (waiting) {
        const playButton = document.createElement('a')
        playButton.href = `/game/checkers?room=${roomId}`
        playButton.classList.add('btn', 'btn-primary')
        playButton.textContent = 'Play'
        cardBody.appendChild(playButton)
    }

    // Append card body to card
    card.appendChild(cardBody)

    // Append card to the room list
    roomList.appendChild(card)
}

// -------------------------------- problem jest tu --------------------------------
async function createRoom() {
    // plz nie komentuj, że te numery są losowe i mogą się powtórzyć XD
    // jak dostanę dostęp do listy pokojów, to im nie pozwolę
    // todo: (komentarz) naprawic to bo ja zapomne
    function generateRoomId() {
        return (Math.floor(Math.random() * 1000000)).toString()
    }

    const roomId = generateRoomId()
    try {
        const response = axios.post('/api/rooms', {
            roomId: roomId,
            waiting: true
        })

        const data = response.data
        console.log('Room created:', data)
        addRoomCard(data.roomId, true)  //  to zadziała, jak odkomentuję
        await getRoomsList()
        // window.location.href = `/game/checkers?room=${data.roomId}`
    } catch (error) {
        console.error('Błąd podczas tworzenia pokoju:', error)
    }
}

async function getRoomsList() {
    try {
        const response = await axios.get('/api/rooms', {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = response.data
        console.log(`Fetched ${data.length} rooms`)

        data.forEach(room => {
            console.log(room)
            addRoomCard(room.roomId, room.waiting)
        })

    } catch (error) {
        console.error('Błąd podczas tworzenia pokoju:', error)
    }
}


// -------------------------------------------------------------------------------

new_game_btn.addEventListener('click', createRoom)
getRoomsList()
