'use strict'

const express = require('express')
const app = express()
const path = require('node:path')
const fs = require('node:fs')
const bodyParser = require('body-parser')

const PORT = 5005
const IP = '127.0.0.1'
const FILE = 'scores.csv'

app.use(express.static(path.join(__dirname, '..', 'frontend')))
app.use(express.json())
app.use(bodyParser.text({ type: 'text/plain' }));

app.listen(PORT, IP, () => console.log(`Server is listening on port ${PORT}`))

// ROUTES

app.get('/', (req, res) => res.redirect('/friday.html'))

app.post('/score', (req, res) => {
  const date = new Date(); // Use new Date() for the current date or new Date("2024-02-23T12:43:54") for a specific date

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add  1 to get the correct month number and pad with  0
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  try {
    const { score, isGameWon, difficultyLevel } = req.body
    const gameResult = isGameWon === undefined ? undefined : isGameWon ? 'survived' : 'died'

    const newLine = `"${formattedDate}","${req.socket.remoteAddress}","${difficultyLevel}","${gameResult}","${score?.total}","${score?.fightingCards}","${score?.defeatedPirates}","${score?.remainingLifePoints}","${score?.unbeatenHazards}"`
    
    if (!fs.existsSync(FILE)) {
      fs.appendFileSync(FILE, `"Date","IP","Difficulty","Result","Total","Fighting","Pirates","Lives","Hazards"\n`)
    } 
    fs.appendFileSync(FILE, `${newLine}\n`)

    res.json({ message: 'Saved' })
    console.log(`Received new scores: ${newLine}`)

  } catch (error) {
    console.log(error.message)
  }

})

app.post('/ping', (req, res) => {
  if (req.body === 'ping') {
    res.send('pong')
    console.log('ping')
  }
})