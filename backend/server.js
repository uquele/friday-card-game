'use strict'

const express = require('express')
const app = express()
const path = require('node:path')
const fs = require('node:fs/promises')
const bodyParser = require('body-parser')

const PORT = 5005
const IP = '127.0.0.1'
const FILE = 'scores.csv'

app.use(express.static(path.join(__dirname, '..', 'frontend')))
app.use(express.json())
app.use(bodyParser.text({ type: 'text/plain' }));

app.listen(PORT, IP, () => console.log(`Server is listening on ${IP}:${PORT}`))

// ROUTES

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

    const firstLine = `"Date","IP","Difficulty","Result","Total","Fighting","Pirates","Lives","Hazards"\n` // <- if you edit this, check for parsing below
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

    /**
     * 
     * @param {number} n 
     * @returns { 'st' | 'nd' | 'rd' | 'th' }
     */
    function th(n) {
      const last1 = n % 10
      const last2 = n % 100
      if (last1 === 1 && last2 !== 11) return 'st'
      if (last1 === 2 && last2 !== 12) return 'nd'
      if (last1 === 3 && last2 !== 13) return 'rd'
      return 'th'
    }

  }

})

app.post('/friday/ping', (req, res) => {
  res.sendStatus(204)
  console.log('/ping', req.socket.remoteAddress)
})

app.all('*', (req, res) => {
  console.log(req.method, req.url, 'route not specified')
  res.statusCode = 404
  res.end()
})

// UTILS 

/**
 * 
 * @param {Date} dateObj 
 * @returns {string} "1999-02-27 03:12:49"
 */
function formattedDate(dateObj) {
  const date = dateObj; // Use new Date() for the current date or new Date("2024-02-23T12:43:54") for a specific date

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add  1 to get the correct month number and pad with  0
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}