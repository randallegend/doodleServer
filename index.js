import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

// Define a route if necessary
app.get('/', (req, res) => {
    res.send('Server is running')
})

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('drawing', (data) => {
        console.log('Touch event received:', data)
        // You can handle the data here, such as broadcasting to other clients
        socket.broadcast.emit('drawing', data)
    });

    socket.on('changeColor', (data) => {
        console.log('Changed color to:', data)
        socket.broadcast.emit('changeColor', data)
    })

    socket.on('eraseDrawing', (data) => {
        console.log('erase drawing:', data)
        socket.broadcast.emit('eraseDrawing', data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

// Start the server
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}*`)
})