'use strict'
//@ts-check

const cards = parseTSV(CARDS_TSV)
// console.table(cards)


// INITIAL SETUP

const deckFighting = cards.filter(card => card.type === 'Fighting')
const deckFightingDiscard = []
const deckHazard = cards.filter(card => card.type === 'Hazard')
const deckHazardDiscard = []
const deckAging = cards.filter(card => card.type === 'Aging')
const deckPirates = cards.filter(card => card.type === 'Pirates')

const currentHazard = []
const deckLeftSide = []
const deckRightSide = []

let difficultyLevel = 1
let lives = 20
let livesMax = 22

switch (difficultyLevel) {
  case 1:
    removeCard({name: 'Very stupid'}, deckAging)
    break
  case 2:
    removeCard({name: 'Very stupid'}, deckAging)
    deckFighting.push(drawCard(deckAging, 'random'))
    break
  case 3:
    deckFighting.push(drawCard(deckAging, 'random'))
    break
  case 4:
    lives = 18
    livesMax = 20
    deckFighting.push(drawCard(deckAging, 'random'))
    break
  default:
    throw new TypeError(`Difficulty level not found: ${level}`)
}

shuffle(deckFighting)
shuffle(deckHazard)
shuffle(deckAging)
shuffle(deckPirates)




