//@ts-check
'use strict'

const express = require('express')
const app = express()
const path = require('node:path')
const fs = require('node:fs/promises')
const bodyParser = require('body-parser')

const PORT = 5005
const IP = '192.168.88.197'
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

    const firstLine = `"Date","IP","Difficulty","Result","Total","Fighting","Pirates","Lives","Hazards"\n`
    const newLine = `\n"${formattedDate}","${req.socket.remoteAddress}","${difficultyLevel}","${gameResult}","${score?.total}","${score?.fightingCards}","${score?.defeatedPirates}","${score?.remainingLifePoints}","${score?.unbeatenHazards}"`;

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
    //@ts-ignore Not good.
    const scoresAboveOurs = scoresSameDifficulty.filter(score => score.Total > scoreToCompare)

    const totalGames = scoresSameDifficulty.length
    const place = scoresAboveOurs.length + 1
    return `${place}${th(place)} place (${totalGames} games were played)`


    /**
     * 
     * @param {string} csvString 
     * @returns {Object<string, string | number>[]}
     */
    function parseScores(csvString) {
      const scores = []
      let keys

      const lines = csvString.split('\n')

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') continue

        let dataArray = lines[i].split(',')
        dataArray = dataArray.map(data => data.slice(1, -1))

        if (i === 0) {
          keys = dataArray
          continue
        }

        /**
         * @type {Object<string, string | number>}
         */
        const scoreObj = {}
        for (let j = 0; j < keys.length; j++) {
          scoreObj[keys[j]] = Number.isFinite(+dataArray[j]) ? +dataArray[j] : dataArray[j]
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
      const last2 = n % 100
      if (last2 === 1) return 'st'
      if (last2 === 2) return 'nd'
      if (last2 === 3) return 'rd'
      return 'th'
    }

  }



})

app.post('/ping', (req, res) => {
  if (req.body === 'ping') {
    res.send('pong')
    console.log('ping')
  }
})