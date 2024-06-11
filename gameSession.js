class GameSession {
    generateGameCode() {}
    startGame() {}
    startTimer() {}
    updateHighScores(playerId, score) {}
    addPlayer(playerId) {}
    removePlayer(playerId) {}
    isStarted(){}
}

class Game extends GameSession {
    constructor(roomId, io) {
        super()
        this.started = false
        this.roomId = roomId
        this.io = io
        this.players = []
        this.highScores = []
        this.timer = null
        this.timeRemaining = 60 // Example duration in seconds
    }

    startGame() {
        this.started = true;
    }

    startTimer() {
        clearInterval(this.timer)
        this.timeRemaining = 60 // Reset timer to 60 seconds for a new game
        this.timer = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--
                this.io.to(this.roomId).emit('timerUpdate', this.timeRemaining)
            } else {
                clearInterval(this.timer)
                this.io.to(this.roomId).emit('gameOver')
                // Optionally reset game state here
            }
        }, 1000);
        this.io.to(this.roomId).emit('gameStart')
    }

    updateHighScores(playerId, score) {
        let player = this.highScores.find(p => p.id === playerId)
        if (player) {
            player.score = Math.max(player.score, score)
        } else {
            this.highScores.push({ id: playerId, score })
        }
        this.highScores.sort((a, b) => b.score - a.score)
        this.io.to(this.roomId).emit('highScores', this.highScores)
    }

    addPlayer(playerId) {
        if (!this.players.includes(playerId)) {
            this.players.push(playerId)
        }
    }

    getPlayers() {
        return this.players
    }
    

    removePlayer(playerId) {
        this.players = this.players.filter(id => id !== playerId)
        //this.highScores = this.highScores.filter(p => p.id !== playerId)
    }

    isStarted(){
        return this.started
    }
}

export default Game
