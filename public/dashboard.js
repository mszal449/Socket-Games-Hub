import axios from './axiosInstance.js'
const new_game_btn = document.getElementById('new_game_btn')
const roomList = document.getElementById('roomList')


function addRoomCard(roomId, waiting) {

    async function enterGameAction(roomId) {
        try {
            await axios.patch(`/game/rooms/${roomId}`, {waiting: false});
            console.log(`Room ${roomId} status updated on the server`);
            window.location.href = `/game/checkers?room=${roomId}`
        } catch (error) {
            console.error(`Error updating room ${roomId} status:`, error);
        }
    }

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
        playButton.classList.add('btn', 'btn-primary')
        playButton.textContent = 'Play'
        playButton.addEventListener('click', async () => {
            await enterGameAction(roomId)
        })
        cardBody.appendChild(playButton)
    }

    // Append card body to card
    card.appendChild(cardBody)

    // Append card to the room list
    roomList.appendChild(card)
}


async function createRoom() {

    function generateRoomId() {
        return (Math.floor(Math.random() * (9999 - 1001) + 9999)).toString()
    }

    async function getRoomIds() {
        const response = await axios.get('/game/rooms', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return Object.keys(response.data)
    }

    let newRoomId = generateRoomId()
    let roomIds = await getRoomIds()
    while (roomIds.includes(newRoomId)) {
        newRoomId = generateRoomId()
    }
    try {
        const response = await axios.post('/game/rooms', {
            roomId: newRoomId,
            waiting: true
        })

        const data = response.data
        console.log('Room created:', data)
        window.location.href = `/game/checkers?room=${data.roomId}`
    } catch (error) {
        console.error('Error creating the room: ', error)
    }
}

async function refreshRoomList() {
    try {
        const response = await axios.get('/game/rooms', {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = response.data
        roomList.textContent = ""
        Object.entries(data).forEach(([roomId, waiting]) => {
            addRoomCard(roomId, waiting);
        });

    } catch (error) {
        console.error('Error getting rooms list: ', error)
    }
}

new_game_btn.addEventListener('click', createRoom)
refreshRoomList()
