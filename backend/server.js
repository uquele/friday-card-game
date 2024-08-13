//@ts-check
'use strict'

const express = require('express')
const app = express()
const path = require('node:path')
const fs = require('node:fs/promises')
// const bodyParser = require('body-parser')

const formattedDate = require('./utils/formatted-date.js')
const th = require('./utils/n-th.js')

const PORT = 5005
const IP = '127.0.0.1'
const FILE = 'scores.csv'

app.use(express.static(path.join(__dirname, '..', 'frontend')))
app.use(express.json())
// app.use(bodyParser.text({ type: 'text/plain' }));

app.listen(PORT, IP, () => console.log(`Server is listening on ${IP}:${PORT}`))

// ROUTES

app.get('/',        (req, res) => res.redirect('/friday.html'))
app.get('/friday/', (req, res) => res.redirect('/friday.html'))

app.post('/friday/score', (req, res) => {
  try {
    /**
     * @type {{
     *   score: {
     *     fightingCards: number
     *     defeatedPirates: number
     *     remainingLifePoints: number
     *     unbeatenHazards: number
     *     total: number
     *   },
     *   isGameWon: boolean,
     *   difficultyLevel: 1 | 2 | 3 | 4
     *   }
     * }
     */
    const { score, isGameWon, difficultyLevel } = req.body
    const gameResult = isGameWon === undefined ? undefined : isGameWon ? 'survived' : 'died'

    const firstLine = `"Date","IP","Difficulty","Result","Total","Fighting","Pirates","Lives","Hazards"` // <- if you edit this, check for parsing below
    const newLine = `\n"${formattedDate(new Date())}","${req.socket.remoteAddress}","${difficultyLevel}","${gameResult}","${score?.total}","${score?.fightingCards}","${score?.defeatedPirates}","${score?.remainingLifePoints}","${score?.unbeatenHazards}"`;

    console.log(`Received new scores: ${newLine}`)

    fs.access(FILE, fs.constants.R_OK | fs.constants.W_OK)
      .then(() => fs.appendFile(FILE, newLine))
      .catch((error) => {
        if (error.code === 'ENOENT') {
          console.log(`New ${FILE} was created as it was not found`)
          return fs.appendFile(FILE, firstLine + newLine)
        } else {
          return Promise.reject(error)
        }
      })
      .then(() => getRankString(score.total, difficultyLevel))
      .then((rankString) => {
        console.log(`Responded with place: ${rankString}`)
        return res.json({ message: 'Saved', rankString })
      })
      .catch(error => {
        console.log(`Error with file ${FILE}. Code: ${error.code}. Message: ${error.message}`)
        res.json({ message: 'Server error' })
      })

  } catch (error) {
    console.log(`Error receiving scores. Code: ${error.code}. Message: ${error.message}`)
    res.json({ message: 'Server error' })
  }

  /**
   * 
   * @param {number} scoreToCompare 
   * @param { 1 | 2 | 3 | 4 } difficulty 
   * @returns {Promise<string>}
   */
  async function getRankString(scoreToCompare, difficulty) {
    let csvString

    try {
      csvString = await fs.readFile(FILE, 'utf-8')
    } catch (error) {
      console.log(`Error reading file ${FILE}. Code: ${error.code}. Message: ${error.message}`)
      return ''
    }

    const scores = parseScores(csvString)
    const scoresSameDifficulty = scores.filter(score => score.Difficulty === difficulty)
    const scoresAboveOurs = scoresSameDifficulty.filter(score => score.Total > scoreToCompare)

    const totalGames = scoresSameDifficulty.length
    const place = scoresAboveOurs.length + 1
    return `${place}${th(place)} place (of ${totalGames})`


    /**
     * @typedef {{
     *   Date: string, 
     *   IP: string, 
     *   Difficulty: number, 
     *   Result: number, 
     *   Total: number, 
     *   Fighting: number, 
     *   Pirates: number, 
     *   Lives: number, 
     *   Hazards: number
     * }} ScoreReceived
     */
    /**
     * 
     * @param {string} csvString 
     * @returns {ScoreReceived[]}
     */
    function parseScores(csvString) {
      const scores = []

      const lines = csvString.split('\n')

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue

        let dataArray = lines[i].split(',')
        dataArray = dataArray.map(data => data.slice(1, -1))

        const scoreObj = {
          Date:        dataArray[0], 
          IP:          dataArray[1],
          Difficulty: +dataArray[2], 
          Result:     +dataArray[3], 
          Total:      +dataArray[4], 
          Fighting:   +dataArray[5], 
          Pirates:    +dataArray[6], 
          Lives:      +dataArray[7], 
          Hazards:    +dataArray[8]
        }

        scores.push(scoreObj)
      }

      return scores

    }



  }

})

app.post('/friday/ping', (req, res) => {
  console.log('/ping', req.socket.remoteAddress)
  res.sendStatus(204)
})

app.all('*', (req, res) => {
  console.log(req.method, req.url, 'route not specified')
  res.sendStatus(404)
})