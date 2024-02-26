'use strict'

import { createAllCards } from "./js/card-creation/createAllCards.js"
import { Card } from "./js/classes/card.js"
import { Deck } from "./js/classes/deck.js"
import { deckClosedHTML, deckDiscardHTML, deckOpenHTML } from "./js/html-components/deckHTML.js"

function $(cssSelector) {
  return document.querySelector(cssSelector)
}

const game = {
  difficultyLevel: 1, // not implemented
  _lives: 20,
  livesMax: 22,
  phases: ['', 'green', 'yellow', 'red', 'pirates'],
  phaseIndex: 0,

  // effectPhaseMinus1: false,

  get phase() {
    return this.phases[this.phaseIndex]
  },

  nextPhase() {
    if (this.phaseIndex === this.phases.length - 1) throw new Error(`Already on last phase`)
    this.phaseIndex++
    UI.updatePhase()
  },

  get lives() {
    return this._lives
  },

  set lives(num) {
    this._lives = Math.min(num, this.livesMax)
    UI.updateLives()
  }
}

const fight = {
  phaseIndexAdditional: 0,
  livesLostThisFight: 0,

  get phase() {
    return game.phases[this.phaseIndex]
  },

  get phaseIndex() {
    const index = game.phaseIndex + this.phaseIndexAdditional
    const min = 1
    const max = game.phases.length - 1
    return Math.min(Math.max(index, min), max)
  },

  removeAllModifications() {
    this.phaseIndexAdditional = 0

    const allCards = [...deckLeft.cards, ...deckCenter.cards, ...deckRight.cards]
    allCards.forEach(card => card.removeModifications())
  },

  get isEffectStop() {
    return !!deckLeft.cards.find(card => card.agingEffectName === 'Stop')
  },

  get ignoredMaxPowerCards() {
    const agingHighest0CardsLength = [...deckLeft.cards, ...deckRight.cards].filter(card => card.agingEffectName === 'Highest 0').length
    const ignoredMaxPowerCards = []

    while (ignoredMaxPowerCards.length < agingHighest0CardsLength) {
      let maxPowerValue = -Infinity
      let maxPowerCard

      fight.allCards.forEach(card => {
        if (ignoredMaxPowerCards.includes(card)) return
        if (card.power > maxPowerValue || (card.power === maxPowerValue && !card.effectDouble)) {
          maxPowerValue = card.power
          maxPowerCard = card
        }
      })

      ignoredMaxPowerCards.push(maxPowerCard)
    }
    return ignoredMaxPowerCards
  },

  get powerDifference() {
    const totalPower = fight.allCards.reduce((sum, card) => {
      //@ts-ignore
      if (fight.ignoredMaxPowerCards.includes(card)) return sum
      if (card.effectDouble) return sum + card.power * 2
      return sum + card.power
    }, 0)

    return totalPower - deckCenter.totalObstacle(fight.phase)
  },

  calculateLivesLostThisFight() {
    return this.livesLostThisFight = Math.max(-fight.powerDifference, 0)
  },

  get agingCardLifeLoss() {
    let sum = 0;
    sum += fight.allCards.filter(card => card.agingEffectName === 'Life -1').length
    sum += fight.allCards.filter(card => card.agingEffectName === 'Life -2').length * 2
    return sum
  },

  get allCards() {
    return [...deckLeft.cards, ...deckRight.cards]
  },


}

const UI = {
  drawDecks() {
    // setup check

    // console.log('deckFighting')
    // console.log(deckFighting)
    // console.log('deckHazard')
    // console.log(deckHazard)
    // console.log('deckAging')
    // console.log(deckAging)
    // console.log('deckPirates')
    // console.log(deckPirates)

    // !!! NOTE !!!
    // Deck elements are constant, while card elements are always redrawn.
    // You will need to reattach all event listners to cards, but it is options for decks
    // This also means that removing event listners from cards in not needed, but is needed for decks

    $('#grid-deck-hazard').innerHTML = deckClosedHTML(deckHazard, { displayName: 'Hazard', id: 'hazard' })
    $('#grid-deck-fighting').innerHTML = deckClosedHTML(deckFighting, { displayName: 'Fighting', id: 'fighting' })
    $('#grid-deck-aging-and-fighting-discard').innerHTML = deckClosedHTML(deckAging, { displayName: 'Aging', id: 'aging' }) + deckDiscardHTML(deckFightingDiscard, { displayName: 'Fighting', id: 'fightingDiscard' })
    $('#grid-deck-hazard-discard').innerHTML = deckDiscardHTML(deckHazardDiscard, { displayName: 'Hazard', id: 'hazardDiscard' })

    const phaseInFight = fight.phase
    const ignoredMaxPowerCards = fight.ignoredMaxPowerCards
    const isStop = fight.isEffectStop

    $('#deck-left').innerHTML = deckOpenHTML({ deck: deckLeft, phaseInFight, ignoredMaxPowerCards })
    $('#deck-center').innerHTML = deckOpenHTML({ deck: deckCenter, phaseInFight, ignoredMaxPowerCards, isStop })
    $('#deck-right').innerHTML = deckOpenHTML({ deck: deckRight, phaseInFight, ignoredMaxPowerCards })

    // $('#hazard').addEventListener('click', deckClick)
    // $('#fighting').addEventListener('click', deckClick)
    // $('#aging').addEventListener('click', deckClick)
  },

  updateInterfaceForFight() {
    $('#help').innerText = `Add fighting cards from the deck, use card abilities or end fight`

    UI.drawDecks()

    UI.hideAllButtons()
    $('#end-fight').hidden = false
    UI.updateEndFightButtonText()

    $('#grid-deck-fighting').addEventListener('click', fightingDeckClick)
    fight.allCards.forEach(card => UI.addCardEvent(card, useCardEffectClick))
  },

  updatePhase() {
    $('#phase').innerText = game.phases[game.phaseIndex];
    const classes = game.phases.map(phase => `phase-${phase}`)

    if (game.phaseIndex >= 1) {
      $('#play-area').classList.remove(classes[game.phaseIndex - 1])
    }
    $('#play-area').classList.add(classes[game.phaseIndex])
  },

  updateEndFightButtonText() {
    $('#end-fight').innerText = `End fight (${fight.powerDifference})`
  },

  updateNextFightButtonText() {
    $('#next-fight').innerText = `Next fight (${fight.livesLostThisFight})`
  },

  updateLives() {
    $('#lives').innerText = game.lives;
    if (game.lives <= 0) $('#game-over').innerText = 'ROBINSON DIED - NO HEALTH LEFT'
  },

  // events

  addCardEvent(card, fn) {
    return $(`#card${card.id}`).addEventListener('click', fn)
  },

  removeCardEvent(card, fn) {
    return $(`#card${card.id}`).removeEventListener('click', fn)
  },

  removeAllEvents() {
    $('#grid-deck-fighting').removeEventListener('click', fightingDeckClick)
    fight.allCards.forEach(card => UI.removeCardEvent(card, useCardEffectClick))
  },

  hideAllButtons() {
    $('#start-game').hidden = true
    $('#end-fight').hidden = true
    $('#next-fight').hidden = true
    $('#fight-hazard').hidden = true
    $('#discard-hazard').hidden = true
    $('#stop-exchanging').hidden = true
  },

  // search

  /**
   * 
   * @param {*} element 
   * @returns {[Card, Deck]}
   */
  findCardAndDeck(element) {
    return [UI.findCard(element), UI.findDeck(element)]
  },

  findCard(element) {
    const cardId = UI.findCardId(element)
    const deck = UI.findDeck(element)
    return deck.findCardById(cardId)
  },

  findDeck(element) {
    const elemId = UI.findId(element)
    if (!elemId.startsWith('deck-')) return UI.findDeck($(`#${elemId}`).parentElement)
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
  },

  findCardId(element) {
    const elemId = UI.findId(element)
    if (!elemId.startsWith('card')) throw new Error(`Unexpected element id: ${element.id}`)
    return +elemId.slice(4)
  },

  findId(element) {
    if (element.id) return element.id
    return UI.findId(element.parentElement)
  },


}

//#region   CREATE ALL DECKS

const CARDS = createAllCards()
Object.freeze(CARDS)

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

//#endregion

//#region   PREPARE DECKS FOR THE GAME
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
//#endregion

//#region   PREPARE UI FOR THE GAME

UI.drawDecks()
UI.updateLives()
UI.updatePhase()
$('#start-game').hidden = false
$('#help').innerText = ''

// set button events
$('#start-game').addEventListener('click', startGame); // <- game starts here
$('#end-fight').addEventListener('click', endFightClick)
$('#next-fight').addEventListener('click', nextFightClick)
$('#fight-hazard').addEventListener('click', fightHazardClick)
$('#discard-hazard').addEventListener('click', discardHazardClick)
$('#stop-exchanging').addEventListener('click', stopExchangingClick)

//#endregion

//#region   CLICK ACTIONS

function startGame() {
  UI.hideAllButtons()
  game.nextPhase()
  chooseAHazard()
}

// before fight

function chooseAHazard() {
  if (deckHazard.length === 0) {
    deckHazardDiscard.shuffle()
    deckHazard.addCards(deckHazardDiscard.removeAllCards())
    game.nextPhase()
  }

  if (deckHazard.length === 1) {
    const card1 = deckHazard.drawCard()
    deckCenter.addCard(card1)

    UI.drawDecks()
    $('#fight-hazard').hidden = false
    $("#discard-hazard").hidden = false
    $('#help').innerText = `Choose whether you want to find the last remaining hazard in the deck`
    return
  }

  const card1 = deckHazard.drawCard()
  const card2 = deckHazard.drawCard()
  deckCenter.addCard(card1)
  deckCenter.addCard(card2)

  UI.drawDecks()
  UI.addCardEvent(card1, hazardChosenClick)
  UI.addCardEvent(card2, hazardChosenClick)
  $('#help').innerText = `Choose 1 hazard card`
}

function hazardChosenClick(event) {
  const cardId = UI.findCardId(event.target)
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

function discardHazardClick() {
  $('#fight-hazard').hidden = true
  $("#discard-hazard").hidden = true

  deckHazardDiscard.addCards(deckCenter.removeAllCards())
  chooseAHazard()
}

// during fight

function fightingDeckClick() {
  if (deckFighting.length === 0) fightingDeckRestock()

  const freeDraw = deckLeft.length < deckCenter.totalDraw && !fight.isEffectStop

  if (freeDraw) {
    deckLeft.addCard(deckFighting.drawCard())
  } else {
    game.lives--
    deckRight.addCard(deckFighting.drawCard())
  }

  UI.updateInterfaceForFight()
}

function fightingDeckRestock() {
  if (deckAging.length === 0) {
    $('#game-over').innerText = 'ROBINSON DIED FROM OLD AGE'
  }
  deckFightingDiscard.addCard(deckAging.drawCard())
  deckFightingDiscard.shuffle()
  deckFighting.addCards(deckFightingDiscard.removeAllCards())

}

function useCardEffectClick(event) {
  const [cardClicked, deck] = UI.findCardAndDeck(event.target)
  const centerCard = deckCenter.cards[0]

  if (cardClicked.skillName === '' || cardClicked.skillUsed) return

  switch (cardClicked.skillName) {
    case 'Life +2':
      game.lives++
    case 'Life +1':
      game.lives++
      cardClicked.skillUsed = true
      UI.updateInterfaceForFight()
      break;

    case 'Draw +2':
      centerCard.additionalDraw++
    case 'Draw +1':
      centerCard.additionalDraw++
      cardClicked.skillUsed = true
      UI.updateInterfaceForFight()
      break

    case 'Stage -1':
      if (fight.phase === 'green') return
      fight.phaseIndexAdditional--
      cardClicked.skillUsed = true
      UI.updateInterfaceForFight()
      break

    case 'Double':
      const appliedDoubleCards = fight.allCards.filter(card => card.effectDouble)
      const nothingToApplyEffectOn = fight.allCards.length - appliedDoubleCards.length <= 1
      if (nothingToApplyEffectOn) return

      cardClicked.skillUsed = true

      $('#help').innerText = `Choose a card to apply 'Double' effect`
      UI.hideAllButtons()
      UI.removeAllEvents()

      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id || appliedDoubleCards.includes(card)) return
        UI.addCardEvent(card, applyEffectDoubleClick)
      });

      break

    case 'Exchange 1':
      if (deckFightingDiscard.length === 0) return
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      $('#help').innerText = `Choose a card to exchange with discard pile`;
      UI.removeAllEvents()
      UI.hideAllButtons()

      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, applyEffectExchange)
      })

      break;

    case 'Exchange 2':
      if (deckFightingDiscard.length === 0) return
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      $('#help').innerText = `Choose the 1st card to exchange with discard pile`;
      UI.removeAllEvents()
      UI.hideAllButtons()

      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, (event) => applyEffectExchange1(event, cardClicked))
      })

      break;

    case 'Put under pile':
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      $('#help').innerText = `Choose a card to put under the fighting deck`;
      UI.removeAllEvents()
      UI.hideAllButtons()

      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, applyEffectPutUnderPile)
      })

      break

    case 'Destroy':
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      $('#help').innerText = `Choose a card to destroy`;
      UI.removeAllEvents()
      UI.hideAllButtons()

      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, applyEffectDestroy)
      })

      break

    case 'Copy':
      const cardsWithSkill = fight.allCards.filter(card => card.skillName).length
      if (cardsWithSkill <= 1) return

      $('#help').innerText = `Choose a card to copy it's effect`;
      UI.removeAllEvents()
      UI.hideAllButtons()

      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id || !card.skillName) return
        UI.addCardEvent(card, (event) => applyEffectCopy(event, cardClicked))
      })

      break

    default:
      break;
  }
}

function applyEffectDoubleClick(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  card.effectDouble = true

  UI.updateInterfaceForFight()
}

function applyEffectExchange(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  card.removeModifications()

  deck.addCard(deckFightingDiscard.drawCard('random'), deck.findIndex(card))
  deckFightingDiscard.addCard(deck.removeCard(card), 'top')

  UI.updateInterfaceForFight()
}

function applyEffectExchange1(event, cardExchange) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  card.removeModifications()

  deck.addCard(deckFightingDiscard.drawCard('random'), deck.findIndex(card))
  deckFightingDiscard.addCard(deck.removeCard(card), 'top')

  $('#help').innerText = `Choose the 2nd card to exchange with discard pile or click 'Stop exchanging'`;
  UI.drawDecks()
  $('#stop-exchanging').hidden = false

  fight.allCards.forEach(card => {
    if (card.id === cardExchange.id) return
    UI.addCardEvent(card, applyEffectExchange2)
  })
}

function applyEffectExchange2(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  card.removeModifications()

  deck.addCard(deckFightingDiscard.drawCard('random-except-top'), deck.findIndex(card))
  deckFightingDiscard.addCard(deck.removeCard(card), 'top')

  UI.updateInterfaceForFight()
}

function stopExchangingClick() {
  UI.updateInterfaceForFight()
}

function applyEffectPutUnderPile(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  card.removeModifications()

  if (deckFighting.length === 0) fightingDeckRestock()

  deckFighting.addCard(deck.removeCard(card), 'bottom')

  UI.updateInterfaceForFight()
}

function applyEffectDestroy(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  if (deckLeft.cards.find(c => c === card)) deckCenter.cards[0].additionalDraw -= 1
  deck.removeCard(card)

  UI.updateInterfaceForFight()
}

function applyEffectCopy(event, cardSender) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  cardSender.copiedSkillName = card.skillName

  UI.updateInterfaceForFight()
}

function endFightClick() {
  $('#end-fight').hidden = true
  $('#grid-deck-fighting').removeEventListener('click', fightingDeckClick)

  fight.calculateLivesLostThisFight()
  game.lives = game.lives - fight.livesLostThisFight - fight.agingCardLifeLoss

  const won = fight.livesLostThisFight === 0

  if (won) {
    fight.removeAllModifications()

    const centerCard = deckCenter.drawCard()
    centerCard.fightingSide = true

    deckFightingDiscard.addCard(centerCard)
    deckFightingDiscard.addCards(deckLeft.removeAllCards())
    deckFightingDiscard.addCards(deckRight.removeAllCards())

    chooseAHazard() // loops

  } else {
    $('#help').innerText = `Go to next fight or remove your played fighting cards for health points lost during this fight`

    $('#next-fight').hidden = false
    UI.updateNextFightButtonText()

    fight.allCards.forEach(card => UI.addCardEvent(card, destroyCardForHealth))
  }

}

// after fight

function destroyCardForHealth(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  if (card.removeCost > fight.livesLostThisFight) return

  fight.livesLostThisFight -= card.removeCost
  deck.removeCard(card)

  UI.updateNextFightButtonText()
  UI.drawDecks()
  fight.allCards.forEach(card => UI.addCardEvent(card, destroyCardForHealth))
}

function nextFightClick() {
  UI.hideAllButtons()
  fight.removeAllModifications()

  deckHazardDiscard.addCards(deckCenter.removeAllCards())
  deckFightingDiscard.addCards(deckLeft.removeAllCards())
  deckFightingDiscard.addCards(deckRight.removeAllCards())

  chooseAHazard() // loops
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




