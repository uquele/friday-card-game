//@ts-check
'use strict'

import { deckHTML } from "./js/html-components/deck.js"
import { createAllCards } from "./js/card-creation/createAllCards.js"
import { Deck } from "./js/cardClasses/deckClass.js"
import { deckDiscardHTML } from "./js/html-components/deckDiscard.js"
import { deckOpenHTML } from "./js/html-components/deckOpen.js"


//#region - INITIAL SETUP //

let difficultyLevel = 1 // not implemented
let lives = 20
let livesMax = 22
const phases = ['', 'green', 'yellow', 'red', 'pirates']
let phase = phases[0]
let livesLostThisFight
let effectPhaseMinus1 = false

// create all cards //

const CARDS = createAllCards()
Object.freeze(CARDS)

// create all decks //

const deckFighting = new Deck(CARDS.filter(card => card.type === 'fighting'))
const deckHazard = new Deck(CARDS.filter(card => card.type === 'hazard'))
const deckAgingOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Old'))
const deckAgingVeryOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Very old'))
const deckPirates = new Deck(CARDS.filter(card => card.type === 'pirates'))
const deckFightingDiscard = new Deck()
const deckHazardDiscard = new Deck()
const deckLeft = new Deck()
const deckCenter = new Deck()
const deckRight = new Deck()

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

// interface //

drawDecks()

$('#lives').innerText = lives;
$('#phase').innerText = phase;
$('#start-game').hidden = false;
$('#start-game').addEventListener('click', startGame); // <- game starts here
$('#help').innerText = '';

//#endregion


//#region - ACTIONS //

// before fight

function startGame() {
  $('#start-game').hidden = true;
  $('#end-fight').addEventListener('click', endFightClick) // used later
  $('#next-fight').addEventListener('click', nextFightClick) // used later

  nextPhase()
  chooseAHazard()
}

function chooseAHazard() {
  if (deckHazard.length === 0) {
    deckHazardDiscard.shuffle()
    deckHazard.addCards(deckHazardDiscard.removeAllCards())
    nextPhase()
  }

  if (deckHazard.length === 1) {
    const card1 = deckHazard.drawCard()
    deckCenter.addCard(card1)
    drawDecks()

    $('#fight-hazard').hidden = false
    $("#discard-hazard").hidden = false

    $('#fight-hazard').addEventListener('click', fightHazardClick)
    $("#discard-hazard").addEventListener('click', discardHazardClick)

    $('#help').innerText = `Choose whether you want to find the last remaining hazard in the deck`
    return
  }

  const card1 = deckHazard.drawCard()
  const card2 = deckHazard.drawCard()
  deckCenter.addCard(card1)
  deckCenter.addCard(card2)

  drawDecks()

  $(`#card${card1.id}`).addEventListener('click', hazardChosenClick)
  $(`#card${card2.id}`).addEventListener('click', hazardChosenClick)

  $('#help').innerText = `Choose 1 hazard card`
}

function hazardChosenClick(event) {
  const cardId = findCardID(event.target)
  const index = deckCenter.cards.findIndex(card => card.id === cardId)
  const removeIndex = index === 0 ? 1 : 0
  const cardToRemove = deckCenter.cards[removeIndex]

  deckHazardDiscard.addCard(deckCenter.removeCard(cardToRemove))

  fightingDeckClick()
}

function fightHazardClick() {
  $('#fight-hazard').hidden = true
  $("#discard-hazard").hidden = true

  fightingDeckClick()
}

// during fight

function discardHazardClick() {
  $('#fight-hazard').hidden = true
  $("#discard-hazard").hidden = true

  deckHazardDiscard.addCards(deckCenter.removeAllCards())
  chooseAHazard()
}

function fightingDeckClick() {

  if (deckFighting.length === 0) {
    if (deckAging.length === 0) {
      $('#game-over').innerText = 'ROBINSON DIED FROM OLD AGE'
    }
    deckFightingDiscard.addCard(deckAging.drawCard())
    deckFightingDiscard.shuffle()
    deckFighting.addCards(deckFightingDiscard.removeAllCards())
  }

  const freeDraw = deckLeft.length < deckCenter.totalDraw

  if (freeDraw) {
    deckLeft.addCard(deckFighting.drawCard())
  } else {
    setLives(lives - 1)
    deckRight.addCard(deckFighting.drawCard())
  }

  updateInterfaceForFight()
}

function updateInterfaceForFight() {
  drawDecks()

  $('#grid-deck-fighting').addEventListener('click', fightingDeckClick)

  deckLeft.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', useCardEffect))
  deckRight.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', useCardEffect))

  $('#help').innerText = `Add fighting cards from the deck, use card abilities or end fight`

  $('#end-fight').hidden = false
  updateEndFightButtonText()
}

function useCardEffect(event) {
  const cardId = findCardID(event.target)
  const deck = findDeck(event.target)
  const card = deck.findCardById(cardId)
  const centerCard = deckCenter.cards[0]

  if (card.skillName === '' || card.skillUsed) return

  switch (card.skillName) {
    case 'Life +2':
      setLives(Math.min(lives + 2, livesMax))
      card.skillUsed = true
      break;
    case 'Life +1':
      setLives(Math.min(lives + 1, livesMax))
      card.skillUsed = true
      break
    case 'Draw +1':
      centerCard.additionalDraw += 1
      card.skillUsed = true
      break
    case 'Draw +2':
      centerCard.additionalDraw += 2
      card.skillUsed = true
      break
    case 'Stage -1':
      effectPhaseMinus1 = true
      updateInterfaceForFight()
      break
    default:
      break;
  }


  drawDecks()

  deckLeft.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', useCardEffect))
  deckRight.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', useCardEffect))
}

function endFightClick() {
  $('#end-fight').hidden = true
  $('#grid-deck-fighting').removeEventListener('click', fightingDeckClick)

  livesLostThisFight = Math.max(-powerDifference(), 0)
  setLives(lives - livesLostThisFight)

  let agingCardLifeLoss = 0;
  agingCardLifeLoss += deckLeft.cards.filter(card => card.agingEffectName === 'Life -1').length
  agingCardLifeLoss += deckLeft.cards.filter(card => card.agingEffectName === 'Life -2').length * 2
  agingCardLifeLoss += deckRight.cards.filter(card => card.agingEffectName === 'Life -1').length
  agingCardLifeLoss += deckRight.cards.filter(card => card.agingEffectName === 'Life -2').length * 2
  setLives(lives - agingCardLifeLoss)

  const won = livesLostThisFight === 0

  if (won) {
    removeCardModifications()

    const centerCard = deckCenter.drawCard()
    centerCard.fightingSide = true
    deckFightingDiscard.addCard(centerCard)

    deckFightingDiscard.addCards(deckLeft.removeAllCards())
    deckFightingDiscard.addCards(deckRight.removeAllCards())

    chooseAHazard() // loops

  } else {
    updateNextFightButtonText()

    deckLeft.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', destroyCardForHealth))
    deckRight.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', destroyCardForHealth))

    $('#next-fight').hidden = false

    $('#help').innerText = `Go to next fight or remove your played fighting cards for health points lost during this fight`
  }


}

// after fight

function removeCardModifications() {
  deckLeft.cards.forEach(card => card.skillUsed = false)
  deckRight.cards.forEach(card => card.skillUsed = false)
  deckRight.cards.forEach(card => card.additionalDraw = 0)

  effectPhaseMinus1 = false
}

function destroyCardForHealth(event) {
  const cardId = findCardID(event.target)
  const deck = findDeck(event.target)
  const card = deck.findCardById(cardId)

  if (card.removeCost > livesLostThisFight) return

  livesLostThisFight -= card.removeCost
  deck.removeCard(card)

  updateNextFightButtonText()
  drawDecks()

  deckLeft.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', destroyCardForHealth))
  deckRight.cards.forEach(card => $(`#card${card.id}`).addEventListener('click', destroyCardForHealth))
}

function nextFightClick() {
  $('#next-fight').hidden = true

  removeCardModifications()

  deckHazardDiscard.addCards(deckCenter.removeAllCards())
  deckFightingDiscard.addCards(deckLeft.removeAllCards())
  deckFightingDiscard.addCards(deckRight.removeAllCards())

  chooseAHazard() // loops

}

//#endregion


//#region - RE-DRAW INTERFACE //

function drawDecks() {
  // setup check

  // console.log('deckFighting')
  // console.log(deckFighting)
  // console.log('deckHazard')
  // console.log(deckHazard)
  // console.log('deckAging')
  // console.log(deckAging)
  // console.log('deckPirates')
  // console.log(deckPirates)

  $('#grid-deck-hazard').innerHTML = deckHTML(deckHazard, { displayName: 'Hazard', id: 'hazard' })
  $('#grid-deck-fighting').innerHTML = deckHTML(deckFighting, { displayName: 'Fighting', id: 'fighting' })
  $('#grid-deck-aging-and-fighting-discard').innerHTML = deckHTML(deckAging, { displayName: 'Aging', id: 'aging' }) + deckDiscardHTML(deckFightingDiscard, { displayName: 'Fighting', id: 'fightingDiscard' })
  $('#grid-deck-hazard-discard').innerHTML = deckDiscardHTML(deckHazardDiscard, { displayName: 'Hazard', id: 'hazardDiscard' })
  $('#deck-left').innerHTML = deckOpenHTML(deckLeft, effectPhaseMinus1 ? getPreviousPhase() : phase)
  $('#deck-center').innerHTML = deckOpenHTML(deckCenter, effectPhaseMinus1 ? getPreviousPhase() : phase)
  $('#deck-right').innerHTML = deckOpenHTML(deckRight, effectPhaseMinus1 ? getPreviousPhase() : phase)

  // $('#hazard').addEventListener('click', deckClick)
  // $('#fighting').addEventListener('click', deckClick)
  // $('#aging').addEventListener('click', deckClick)
}

function updateEndFightButtonText() {
  $('#end-fight').innerText = `End fight (${powerDifference()})`
}

function updateNextFightButtonText() {
  $('#next-fight').innerText = `Next fight (${livesLostThisFight})`
}

//#endregion


//#region - HELPERS //

// calculations

function powerDifference() {
  const agingHighest0CardsLength = [...deckLeft.cards, ...deckRight.cards].filter(card => card.agingEffectName === 'Highest 0').length
  const maxPowerCards = []

  while (maxPowerCards.length < agingHighest0CardsLength) {
    let maxPowerValue = -Infinity
    let maxPowerCard
    [...deckLeft.cards, ...deckRight.cards].forEach(card => {
      if (card.power >= maxPowerValue && !maxPowerCards.includes(card)) {
        maxPowerValue = card.power
        maxPowerCard = card
      }
    })
    maxPowerCards.push(maxPowerCard)
  }

  const agingPowerLoss = maxPowerCards.reduce((sum, card) => sum + card.power, 0)

  return deckLeft.totalPower + deckRight.totalPower - agingPowerLoss - deckCenter.totalObstacle(effectPhaseMinus1 ? getPreviousPhase() : phase)
}

function getPreviousPhase() {
  const currentIndex = phases.findIndex(value => value === phase)
  const previousIndex = Math.max(currentIndex - 1, 1)
  return phases[previousIndex]

}

// setters

function setLives(num) {
  if (num <= 0) {
    $('#game-over').innerText = 'ROBINSON DIED - NO HEALTH LEFT'
  }
  lives = num
  $('#lives').innerText = lives;
}

function nextPhase() {
  const currentIndex = phases.findIndex(value => value === phase)
  if (currentIndex === phases.length - 1) throw new Error(`Already on last phase`)

  phase = phases[currentIndex + 1]
  $('#phase').innerText = phase;

  const classes = phases.map(phase => `phase-${phase}`)
  $('#play-area').classList.remove(classes[currentIndex])
  $('#play-area').classList.add(classes[currentIndex + 1])
}

// element search

function $(cssSelector) {
  return document.querySelector(cssSelector)
}

function findID(element) {
  if (element.id) return element.id
  return findID(element.parentElement)
}

function findCardID(element) {
  const elemId = findID(element)
  if (!elemId.startsWith('card')) throw new Error(`Unexpected element id: ${element.id}`)
  return +elemId.slice(4)
}

function findDeck(element) {
  const elemId = findID(element)
  if (!elemId.startsWith('deck-')) return findDeck($(`#${elemId}`).parentElement)
  const deckName = elemId.slice(5)

  switch (deckName) {
    case 'left':
      return deckLeft
    case 'center':
      return deckCenter
    case 'right':
      return deckRight
    default:
      throw new Error(`Deck with name ${deckName} not found`)
  }
}

//#endregion


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




