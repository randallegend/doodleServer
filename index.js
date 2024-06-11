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
    socket.join(socket.username)
    console.log('A user connected with username:', socket.username)

    socket.on('startGame', (gameCode) => {
        games[gameCode].startGame()
        console.log('Game started:', gameCode)
        io.to(gameCode).emit('startGame', gameCode)
    })

    socket.on('hostGame', (data, ackCallback) => {
        const gameCode = generateGameCode()

        games[gameCode] = new Game(gameCode, io)
        socket.join(gameCode)
        console.log(`Game created with code: ${gameCode}`)
        games[gameCode].addPlayer(socket.username)

        ackCallback(gameCode)
    })

    socket.on('joinGame', (gameCode, ackCallback) => {
        if(games[gameCode] && !games[gameCode].isStarted()) {
            socket.join(gameCode)
            games[gameCode].addPlayer(socket.username)
            socket.broadcast.to(gameCode).emit('playerJoined', socket.username)

            ackCallback({status: 'success', players: games[gameCode].getPlayers()})
        }
        else{
            ackCallback({status: 'error', message:`Game room ${gameCode} doesn't exist or already started`})
        }
    })

    socket.on('leaveGame', (gameCode, ackCallback) => {
        if(games[gameCode]){
            socket.broadcast.to(gameCode).emit('playerLeft', socket.username)
            socket.leave(gameCode)
            games[gameCode].removePlayer(socket.username)
            
            ackCallback()
        } 
    })

    socket.on('hostLeave', (gameCode, ackCallback) => {
        if(games[gameCode]){
            socket.broadcast.to(gameCode).emit('hostLeft', socket.username)
            socket.leave(gameCode)
            delete games[gameCode]
            
            ackCallback()
        } 
    })

    socket.on('drawing', (gameCode, data) => {
        console.log('Touch event received:', data)
        // You can handle the data here, such as broadcasting to other clients
        socket.broadcast.to(gameCode).emit('drawing', data)
    })

    socket.on('changeColor', (gameCode, data) => {
        console.log('Changed color to:', data)
        socket.broadcast.to(gameCode).emit('changeColor', data)
    })

    socket.on('eraseDrawing', (gameCode, data) => {
        console.log('erase drawing:', data)
        socket.broadcast.to(gameCode).emit('eraseDrawing', data)
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