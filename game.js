'use strict'

import { createDeckAllCards } from "./card-creation/createDeckAllCards.js"

//@ts-check


// INITIAL SETUP


const CARDS = createDeckAllCards()







const deckFighting = []
const deckFightingDiscard = []
const deckHazard = cards.filter(card => card.type === 'hazard')
const deckHazardDiscard = []
const deckAging = cards.filter(card => card.type === 'aging')
const deckPirates = cards.filter(card => card.type === 'pirates')

const currentHazard = []
const deckLeftSide = []
const deckRightSide = []

let difficultyLevel = 1
let lives = 20
let livesMax = 22

switch (difficultyLevel) {
  case 1:
    removeCard({ name: 'Very stupid' }, deckAging)
    break
  case 2:
    removeCard({ name: 'Very stupid' }, deckAging)
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




