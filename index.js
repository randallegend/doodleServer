import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import Game from './gameSession.js'
import { stat } from 'fs'

const app = express()
const server = createServer(app)
const io = new Server(server)
const games = {}

// Define a route if necessary
app.get('/', (req, res) => {
    res.send('Server is running')
})

io.use((socket, next) => {
    // Example middleware to set socket.username from query parameters
    const username = socket.handshake.query.username
    if (username) {
        socket.username = username
        next()
    } else {
        next(new Error('Authentication error'))
    }
});


// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected with username:', socket.username)

    socket.on('hostGame', (data, ackCallback) => {
        const gameCode = generateGameCode()

        games[gameCode] = new Game(gameCode, io)
        socket.join(gameCode)
        console.log(`Game created with code: ${gameCode}`)
        games[gameCode].addPlayer(socket.username)
        ackCallback(gameCode)
    })

    socket.on('joinGame', (gameCode, ackCallback) => {
        if(games[gameCode]) {
            socket.join(gameCode)
            games[gameCode].addPlayer(socket.username)
            socket.broadcast.to(gameCode).emit('playerJoined', socket.username)
            console.log(games[gameCode].getPlayers())
            ackCallback({status: 'success', players: games[gameCode].getPlayers()})
        }
        else{
            ackCallback({status: 'error', message:`Game room ${gameCode} doesn't exist`})
        }
    })

    socket.on('drawing', (data) => {
        console.log('Touch event received:', data)
        // You can handle the data here, such as broadcasting to other clients
        socket.broadcast.emit('drawing', data)
    })

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


function generateGameCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        code += chars[randomIndex]
    }
    return code
}

// Start the server
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}*`)
})