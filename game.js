//@ts-check
'use strict'

import { createAllCards } from "./js/card-creation/createAllCards.js"
import { Deck } from "./js/card-creation/deckClass.js"


// INITIAL SETUP //

let difficultyLevel = 1 // not implemented
let lives = 20
let livesMax = 22
let phase = 'green' // -> yellow -> red

// have all cards ready //

const CARDS = createAllCards()
Object.freeze(CARDS)

// create all decks //

const deckRobinson = new Deck(CARDS.filter(card => card.type === 'fighting'))
const deckHazard = new Deck(CARDS.filter(card => card.type === 'hazard'))
const deckAgingOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Old'))
const deckAgingVeryOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Very old'))
const deckPirates = new Deck(CARDS.filter(card => card.type === 'pirates'))

if (CARDS.length !== deckRobinson.length + deckHazard.length + deckAgingOld.length + deckAgingVeryOld.length + deckPirates.length) throw new Error(`Seems like some cards did not make it into the decks`)

// easy difficulty setup //

deckRobinson.shuffle()

deckHazard.shuffle()

deckAgingOld.removeCard(CARDS.find(card => card.name === 'Very stupid'))
deckAgingOld.shuffle()
deckAgingVeryOld.shuffle()
const deckAging = new Deck([...deckAgingVeryOld.cards, ...deckAgingOld.cards])

while (deckPirates.length > 2) {
  deckPirates.drawCard('random')
}

const deckRobinsonDiscard = new Deck()
const deckHazardDiscard = new Deck()

// setup check

console.log('deckRobinson')
console.log(deckRobinson)
console.log('deckHazard')
console.log(deckHazard)
console.log('deckAging')
console.log(deckAging)
console.log('deckPirates')
console.log(deckPirates)



const currentHazard = []
const deckLeftSide = []
const deckRightSide = []



// switch (difficultyLevel) {
//   case 1:
//     removeCard({ name: 'Very stupid' }, deckAging)
//     break
//   case 2:
//     removeCard({ name: 'Very stupid' }, deckAging)
//     deckFighting.push(drawCard(deckAging, 'random'))
//     break
//   case 3:
//     deckFighting.push(drawCard(deckAging, 'random'))
//     break
//   case 4:
//     lives = 18
//     livesMax = 20
//     deckFighting.push(drawCard(deckAging, 'random'))
//     break
//   default:
//     throw new TypeError(`Difficulty level not found: ${level}`)
// }




