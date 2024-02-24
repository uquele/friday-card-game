//@ts-check
'use strict'

import { cardHazardHTML } from "./js/html-components/cardHazard.js"
import { cardFightingHTML } from "./js/html-components/cardFighting.js"
import { deckHTML } from "./js/html-components/deck.js"
import { createAllCards } from "./js/card-creation/createAllCards.js"
import { Deck } from "./js/cardClasses/deckClass.js"
import { deckDiscardHTML } from "./js/html-components/deckDiscard.js"


// INITIAL SETUP //

let difficultyLevel = 1 // not implemented
let lives = 20
let livesMax = 22
let phase = 'green' // -> yellow -> red

// have all cards ready //

const CARDS = createAllCards()
Object.freeze(CARDS)

// create all decks //

const deckFighting = new Deck(CARDS.filter(card => card.type === 'fighting'))
const deckHazard = new Deck(CARDS.filter(card => card.type === 'hazard'))
const deckAgingOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Old'))
const deckAgingVeryOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Very old'))
const deckPirates = new Deck(CARDS.filter(card => card.type === 'pirates'))

if (CARDS.length !== deckFighting.length + deckHazard.length + deckAgingOld.length + deckAgingVeryOld.length + deckPirates.length) throw new Error(`Seems like some cards did not make it into the decks`)

// easy difficulty setup //

deckFighting.shuffle()

deckHazard.shuffle()

deckAgingOld.removeCard(CARDS.find(card => card.name === 'Very stupid'))
deckAgingOld.shuffle()
deckAgingVeryOld.shuffle()
const deckAging = new Deck([...deckAgingVeryOld.cards, ...deckAgingOld.cards])

while (deckPirates.length > 2) {
  deckPirates.drawCard('random')
}

const deckFightingDiscard = new Deck()
const deckHazardDiscard = new Deck()

// setup check

console.log('deckFighting')
console.log(deckFighting)
console.log('deckHazard')
console.log(deckHazard)
console.log('deckAging')
console.log(deckAging)
console.log('deckPirates')
console.log(deckPirates)

function $(cssSelector) {
  return document.querySelector(cssSelector)
}

// $('#test1').innerHTML = cardHazardHTML(deckHazard.cards[0])

drawDecks()
function drawDecks() {
  $('#grid-deck-hazard').innerHTML = deckHTML(deckHazard, { displayName: 'Hazard', id: 'hazard' })
  $('#grid-deck-aging').innerHTML = deckHTML(deckAging, { displayName: 'Aging', id: 'aging' })
  $('#grid-deck-fighting').innerHTML = deckHTML(deckFighting, { displayName: 'Fighting', id: 'fighting' })
  $('#grid-deck-aging-and-fighting-discard').innerHTML = deckDiscardHTML(deckFightingDiscard, { displayName: 'Fighting', id: 'fightingDiscard' })
  $('#grid-deck-hazard-discard').innerHTML = deckDiscardHTML(deckHazardDiscard, { displayName: 'Hazard', id: 'hazardDiscard' })
  
  $('#hazard').addEventListener('click', deckClick)
  $('#aging').addEventListener('click', deckClick)
  $('#fighting').addEventListener('click', deckClick)
}





function appendCard(card, cssSelector) {
  document.querySelector(cssSelector).appendChild(createDivElement(cardHTML(card)))

  function createDivElement(HTMLString) {
    const div = document.createElement('div')
    div.innerHTML = HTMLString
    return div
  }

  function cardHTML(card) {
    switch (card.type) {
      case 'fighting':
      case 'aging':
        return cardFightingHTML(card)
      case 'hazard':
        return cardHazardHTML(card)
      default:
        throw new TypeError(`Card type ${card.type} not found`)
    }
  }
}

function deckClick(event) {
  const deckID = findID(event.target)
  const deck = findDeck(deckID)
  const drawnCard = deck.drawCard('top')
  console.log(drawnCard)
  
  appendCard(drawnCard, '#play-area')
  drawDecks()

  function findID(element) {
    if (element.id) return element.id
    return findID(element.parentElement)
  }

  function findDeck(deckID) {
    switch (deckID) {
      case 'hazard':
        return deckHazard
      case 'aging':
        return deckAging
      case 'fighting':
        return deckFighting
      default:
        throw new TypeError(`Deck with deckID of ${deckID} not found`)
    }
  }
}



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




