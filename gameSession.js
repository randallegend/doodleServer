import EasyToDrawWords from "./randomwords.js"
const words = new EasyToDrawWords()

const delay = ms => new Promise(res => setTimeout(res, ms));

class Game {
    constructor(roomId, io) {
        this.started = false
        this.roomId = roomId
        this.io = io

        this.players = []
        this.currPlayer = 0
        
        this.timer = null
        this.timeRemaining = 60 

        this.currWord = ''
        this.correctGuess = 0
        this.round = 0
        this.baseScore = 100
        this.highScores = []
        
        this.readyCount = 0
        this.doodleFinished = false
    }

    startGame() {
        this.started = true
        this.startRound()
    }

    startRound() { 
        this.round++
        this.currPlayer = 0
        this.startDoodle()
    }

    startDoodle() {
        this.doodleFinished = false
        this.currWord = ''
        this.correctGuess = 0
        const pick = words.generateWords(2)
        const player = this.players[this.currPlayer] //get current player
        this.io.to(player).emit('pickWord', pick) //prompt the current player
        this.io.to(this.roomId).emit('pickingWord', player) //notify all players
    }

    async endDoodle() {
        this.doodleFinished = true
        clearInterval(this.timer)
        this.updateHighScore(this.players[this.currPlayer], this.calculateDrawingPoints())
        this.io.to(this.roomId).emit('endDoodle', this.highScores, this.currWord)
        await delay(5000)

        this.resetAddedScore()

        if(this.currPlayer == this.players.length - 1){
            if(this.round == 3) this.endGame()
            else this.startRound()
            return
        }

        this.currPlayer++
        this.startDoodle()
    }

    endGame() {
        this.io.to(this.roomId).emit('endGame', this.highScores)
    }

    startTimer() {
        clearInterval(this.timer)
        this.timeRemaining = 60 // Reset timer to 60 seconds for a new game
        this.timer = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--
                this.io.to(this.roomId).emit('timerUpdate', this.timeRemaining)
            } 
            else 
                this.endDoodle()
        }, 1000)
        this.io.to(this.roomId).emit('gameStart')
    }

    // Function to calculate points for guessing player
    calculateGuessingPoints() {
        const timeElapsed = 60 - this.timeRemaining
        return Math.round(Math.max(0, this.baseScore * (1 - (timeElapsed / 60))));
    }

    // Function to calculate points for drawing player
    calculateDrawingPoints() {
        return Math.round(this.correctGuess * (this.baseScore / 10));
    }

    updateHighScore(playerId, score) {
        let player = this.highScores.find(p => p.id === playerId)
        if (player) {
            player.addedScore = score
            player.score += score
        } else {
            this.highScores.push({ id: playerId, score: score, addedScore: score })
        }
        this.highScores.sort((a, b) => b.score - a.score)
    }

    resetAddedScore() {
        this.highScores.forEach(player => {
            player.addedScore = 0
        })
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
        this.highScores = this.highScores.filter(p => p.id !== playerId)
    }

    isStarted(){
        return this.started
    }

    isCorrect(guess) {
        return this.currWord == guess
    }

    isGuessClose(guess) {
        const minLength = 3; // Minimum length of common substring to consider "close"
      
        // Helper function to find the longest common substring length
        function longestCommonSubstringLength(str1, str2) {
            let maxLength = 0;
            let table = Array(str1.length + 1).fill(null).map(() => Array(str2.length + 1).fill(0));
      
            for (let i = 1; i <= str1.length; i++) {
                for (let j = 1; j <= str2.length; j++) {
                    if (str1[i - 1] === str2[j - 1]) {
                        table[i][j] = table[i - 1][j - 1] + 1;
                        maxLength = Math.max(maxLength, table[i][j]);
                    }
                }
            }
      
            return maxLength;
        }
      
        // Check if the word or guess contains the other as a prefix
        if (this.currWord.startsWith(guess) || guess.startsWith(this.currWord)) {
            return true;
        }
      
        // Check if there is a common substring of at least minLength characters
        return longestCommonSubstringLength(guess, this.currWord) >= minLength;
      }
      
}

export default Game
