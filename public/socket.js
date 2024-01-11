const socket = io('ws://localhost:3000')

socket.on('redirect', (url) => {
    window.location.href = url
})

export default socket
