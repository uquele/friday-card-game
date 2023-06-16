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




/** Removes one card from the deck
 * 
 * @param {Object} cardQuery - for example, {name: 'Very stupid'}
 * @param {Array} deck 
 * @returns {Array} - the removed card
 */

function removeCard(cardQuery, deck) {  // 
  const [[key, value]] = Object.entries(cardQuery)
  const index = deck.findIndex(card => card[key] === value)
  if (index < 0) {
    throw new TypeError(`Card not found: {${key}: ${value}}`)
  }
  const removedCard = deck.splice(index, 1)
  return removedCard;
}

/** Moves one card from one deck to another
 * 
 * @param {Object} cardQuery - for example, {name: 'Very stupid'}
 * @param {Array} deckFrom 
 * @param {Array} deckTo 
 * @param {String} position - where to insert the card. Either 'bottom' or 'top'
 * @returns 
 */

function moveCard(cardQuery, deckFrom, deckTo, position = 'bottom') {
  let insertIndex

  switch (position) {
    case 'bottom':
      insertIndex = 0
      break
    case 'top':
      insertIndex = deckTo.length - 1
      break
    default:
      throw new TypeError(`Position is wrong or not supported. Position: ${position}`)
  }

  const removedCard = removeCard(cardQuery, deckFrom)
  deckTo.splice(insertIndex, 0, removedCard)
  return
}

/** Draws one card from the deck
 * 
 * @param {Array} deck 
 * @param {String} location - 'top', 'bottom', 'random'
 * @returns {Object} - card
 */

function drawCard(deck, location) {
  let index
  switch (location) {
    case 'top':
      index = deck.length - 1
      break
    case 'bottom':
      index = 0
      break
    case 'random':
      index = randomInt(0, deck.length - 1)
      break
    default:
      throw new TypeError(`Wrong location: ${location}`)
  }

  const drawnCard = deck.splice(location, 1);
  return drawnCard;

}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i >= 0; i--) {
    let random = randomInt(0, deck.length - 1);
    [deck[i], deck[random]] = [deck[random], deck[i]]
  }
  return;
}