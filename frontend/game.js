'use strict'

import { createAllCards } from "./js/card-creation/createAllCards.js"
import { Card } from "./js/classes/card.js"
import { Deck } from "./js/classes/deck.js"
import { deckClosedHTML, deckClosedDiscardHTML, deckOpenHTML, healthIconHTML } from "./js/html-components/deckHTML.js"
import { httpPing, httpPostObj } from "./network.js"


function $(cssSelector) {
  return document.querySelector(cssSelector)
}

const UI = {
  drawDecks() {
    // These ids are only for css. For event listeners use their own deck ids

    $('#deck-hazard-discard').outerHTML = deckClosedDiscardHTML(deckHazardDiscard, '#deck-hazard-discard', 'Hazard')
    $('#deck-fighting-discard').outerHTML = deckClosedDiscardHTML(deckFightingDiscard, '#deck-fighting-discard', 'Fighting')

    deckPirates.length <= 2
      ? $('#deck-pirates').outerHTML = deckOpenHTML(deckPirates, '#deck-pirates')
      : $('#deck-pirates').outerHTML = deckClosedHTML(deckPirates, '#deck-pirates', 'Pirates')

    $('#deck-hazard').outerHTML = deckClosedHTML(deckHazard, '#deck-hazard', 'Hazard')
    $('#deck-aging').outerHTML = deckClosedHTML(deckAging, '#deck-aging', 'Aging')
    $('#deck-fighting').outerHTML = deckClosedHTML(deckFighting, '#deck-fighting', 'Fighting')

    $('#deck-vision').outerHTML = deckOpenHTML(deckVision, '#deck-vision', fight)

    $('#deck-left').outerHTML = deckOpenHTML(deckLeft, '#deck-left', fight)
    $('#deck-center').outerHTML = deckOpenHTML(deckCenter, '#deck-center', fight)
    $('#deck-right').outerHTML = deckOpenHTML(deckRight, '#deck-right', fight)
  },

  updateInterfaceForFight() {
    UI.help(`Add fighting cards from the deck, use card abilities or end fight`)

    UI.showButtons(['#end-fight'])

    UI.drawDecks()

    UI.addDeckFightingEvent(fightingDeckClick)
    fight.allCards.forEach(card => UI.addCardEvent(card, useCardEffectClick))
  },

  updateLives() {
    const healthIconHTMLs = game.lives >= 0 ? healthIconHTML.repeat(game.lives) : ''
    $('#health-icons').innerHTML = healthIconHTMLs
    $('#lives-amount').innerText = game.lives

    if (game.lives <= 1) {
      $('#lives-amount').classList.add('very-low')
    } else {
      $('#lives-amount').classList.remove('very-low')
    }
    if (game.lives < 0) {
      game.gameOver('no health')
      return
    }
  },

  updatePhase() {
    const classes = game.phases.map(phase => `phase-${phase}`)

    if (game.phaseIndex >= 1) {
      $('#play-area').classList.remove(classes[game.phaseIndex - 1])
    }
    $('#play-area').classList.add(classes[game.phaseIndex])
  },

  //#region cards and decks

  addCardEvent(card, fn) {
    return $(`#card${card.id}`).addEventListener('click', fn)
  },

  removeCardEvent(card, fn) {
    return $(`#card${card.id}`).removeEventListener('click', fn)
  },

  addDeckFightingEvent(fn) {
    $('#deck-fighting').addEventListener('click', fn)
  },

  removeAllEvents() {
    $('#deck-fighting').removeEventListener('click', fightingDeckClick)
    $('#deck-fighting').removeEventListener('click', applyEffectVisionTakeCardClick)
    fight.allCards.forEach(card => UI.removeCardEvent(card, useCardEffectClick))
  },

  //#endregion

  //#region buttons

  setButtonEvents() {
    $('#start-game').addEventListener('click', startGameClick); // <- game starts here
    $('#difficulty-1').addEventListener('click', setDifficultyClick);
    $('#difficulty-2').addEventListener('click', setDifficultyClick);
    $('#difficulty-3').addEventListener('click', setDifficultyClick);
    $('#difficulty-4').addEventListener('click', setDifficultyClick);
    $('#end-fight').addEventListener('click', endFightClick)
    $('#next-fight').addEventListener('click', nextFightClick)
    $('#fight-hazard').addEventListener('click', fightHazardClick)
    $('#discard-hazard').addEventListener('click', discardHazardClick)
    $('#stop-exchanging').addEventListener('click', stopExchangingClick)
    $('#vision-stop-taking-cards').addEventListener('click', visionStopTakingCardsClick)
    $('#vision-discard-a-card').addEventListener('click', visionDiscardACardClick)
    $('#vision-discard-no-cards').addEventListener('click', visionDiscardNoCardsClick)
    $('#play-again').addEventListener('click', playAgainClick)
  },

  hideAllButtons() {
    for (const button of $('.buttons').children) {
      button.hidden = true
    }
  },

  /**
   * @typedef { "#start-game" | 
   * "#difficulty-1" | 
   * "#difficulty-2" | 
   * "#difficulty-3" | 
   * "#difficulty-4" | 
   * "#end-fight" | 
   * "#next-fight" | 
   * "#fight-hazard" | 
   * "#discard-hazard" | 
   * "#stop-exchanging" | 
   * "#vision-stop-taking-cards" | 
   * "#vision-discard-a-card" | 
   * "#vision-discard-no-cards" |
   * '#play-again'} ButtonCssSelector
   */
  /**
   * 
   * @param {ButtonCssSelector[]} cssSelectors 
   */
  showButtons(cssSelectors) {
    UI.hideAllButtons()
    for (const cssSelector of cssSelectors) {
      $(cssSelector).hidden = false

      if (cssSelector === "#end-fight") UI.updateEndFightButtonText()
      if (cssSelector === "#next-fight") UI.updateNextFightButtonText()
    }
  },

  updateEndFightButtonText() {
    if (game.phase === 'pirates' && fight.powerDifference < 0) {
      $('#end-fight').innerText = `Give up (${fight.powerDifference})`
    } else {
      $('#end-fight').innerText = `End fight (${fight.powerDifference})`
    }

    fight.powerDifference >= 0
      ? $('#end-fight').classList.add('fight-won')
      : $('#end-fight').classList.remove('fight-won')
  },

  updateNextFightButtonText() {
    $('#next-fight').innerText = `Next fight (${fight.livesLostThisFight})`
  },

  //#endregion

  //#region search

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
      case 'vision':
        return deckVision
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

  //#endregion

  help(message) {
    $('#help').innerText = message
  },

  gameOver(gameEndText, serverResponse) {
    $('#game-over').innerText = gameEndText
    UI.help(`Score: ${game.score.total}\n\n\nFighting: ${game.score.fightingCards}, pirates: ${game.score.defeatedPirates}, lives: ${game.score.remainingLifePoints}, hazards: ${game.score.unbeatenHazards}\nDifficulty: ${game.difficultyLevel}`)

    ;(async () => {
      serverResponse.then( ({ message, rankString }) => {
        if (message === 'Saved') {
          // $('#play-again').innerText = `* ${$('#play-again').innerText} *`
          UI.help(`Score: ${game.score.total}\n${rankString}\n\nFighting: ${game.score.fightingCards}, pirates: ${game.score.defeatedPirates}, lives: ${game.score.remainingLifePoints}, hazards: ${game.score.unbeatenHazards}\nDifficulty: ${game.difficultyLevel}`)
        }
        if (message === 'Server error') {
          $('#play-again').innerText = `* ${$('#play-again').innerText} *`
        }
      })
    })()

    UI.showButtons(['#play-again'])

    UI.drawDecks()
    UI.removeAllEvents()
  },
}

const game = {
  difficultyLevel: undefined,
  _lives: undefined,
  livesMax: undefined,
  phases: ['', 'green', 'yellow', 'red', 'pirates'],
  phaseIndex: 0,
  isGameOver: false,
  isGameWon: undefined,
  score: {
    fightingCards: undefined,
    defeatedPirates: undefined,
    remainingLifePoints: undefined,
    unbeatenHazards: undefined,
    get total() {
      const total = this.fightingCards + this.defeatedPirates + this.remainingLifePoints + this.unbeatenHazards
      return Number.isNaN(total) ? undefined : total
    }
  },

  get lives() {
    return this._lives
  },
  set lives(num) {
    this._lives = Math.min(num, this.livesMax)
    UI.updateLives()
  },

  get phase() {
    return this.phases[this.phaseIndex]
  },
  nextPhase() {
    if (this.phaseIndex === this.phases.length - 1) throw new Error(`Already on last phase`)
    this.phaseIndex++
    UI.updatePhase()
  },

  /**
   * 
   * @param {'survived' | 'old age' | 'no health' | 'lost to pirates'} reason 
   */
  gameOver(reason) {
    game.isGameOver = true
    let gameEndText

    switch (reason) {
      case 'survived':
        game.isGameWon = true
        gameEndText = 'ROBINSON SURVIVED!'
        break;
      case 'old age':
        game.isGameWon = false
        gameEndText = 'ROBINSON DIED FROM OLD AGE'
        break;
      case 'no health':
        game.isGameWon = false
        gameEndText = 'ROBINSON DIED FROM FAILING HEALTH'
        break
      case 'lost to pirates':
        game.isGameWon = false
        gameEndText = 'ROBINSON DIED TO PIRATES'
        break
      default:
        throw new Error(`Unexpected game over reason: ${reason}`)
    }

    fight.removeAllModifications()

    deckCenter.removeAllCards().forEach(card => {
      card.type === 'pirates'
        ? deckPirates.addCard(card)
        : deckHazardDiscard.addCard(card)
    }
    )

    deckFightingDiscard.addCards(deckLeft.removeAllCards())
    deckFightingDiscard.addCards(deckRight.removeAllCards())

    game.calculateFinalScore();

    const serverResponse = httpPostObj({ score: game.score, isGameWon: game.isGameWon, difficultyLevel: game.difficultyLevel })

    UI.gameOver(gameEndText, serverResponse)
  },

  calculateFinalScore() {
    game.score.fightingCards = [...deckFighting.cards, ...deckFightingDiscard.cards].reduce((sum, card) => {
      if (card.type === 'aging') return sum - 5
      return sum + card.power
    }, 0)

    game.score.defeatedPirates = (2 - deckPirates.length) * 15
    game.score.remainingLifePoints = game.lives > 0 ? game.lives * 5 : 0
    game.score.unbeatenHazards = (deckHazard.length + deckHazardDiscard.length) * -3
  },
}

// should not be exporting this. Not good
export const fight = {

  // changes to fight state from previous card abilities

  phaseIndexAdditional: 0,
  livesLostThisFight: 0,

  get phase() {
    return game.phases[this.phaseIndex]
  },

  get phaseIndex() {
    const index = keepInRange(game.phaseIndex) + this.phaseIndexAdditional
    return keepInRange(index)

    function keepInRange(num) {
      const min = 1
      const max = 3
      return Math.min(Math.max(num, min), max)
    }
  },

  calculateLivesLostThisFight() {
    return this.livesLostThisFight = Math.max(-fight.powerDifference, 0)
  },

  removeAllModifications() {
    this.phaseIndexAdditional = 0

    const allCards = [...deckLeft.cards, ...deckCenter.cards, ...deckRight.cards]
    allCards.forEach(card => card.removeModifications())
  },

  // cards on the table affecting the fight

  get additionalPowerToAllCards() {
    return deckCenter.cards.find(card => card.pirateEffectName === 'Each of your cards has +1 power') ? 1 : 0
  },

  get isEffectStop() {
    return !!deckLeft.cards.find(card => card.agingEffectName === 'Stop')
  },

  get ignoredHighest0Cards() {
    const agingHighest0CardsLength = fight.allCards.filter(card => card.agingEffectName === 'Highest 0').length
    const ignoredHighest0Cards = []

    while (ignoredHighest0Cards.length < agingHighest0CardsLength) {
      let maxPowerValue = -Infinity
      let maxPowerCard

      fight.allCards.forEach(card => {
        if (ignoredHighest0Cards.includes(card)) return
        if (card.power > maxPowerValue || (card.power === maxPowerValue && !card.effectDouble)) {
          maxPowerValue = card.power
          maxPowerCard = card
        }
      })

      ignoredHighest0Cards.push(maxPowerCard)
    }
    return ignoredHighest0Cards
  },

  get halfZeroPowerCards() {
    if (!deckCenter.cards.find(card => card.pirateEffectName === 'Only half of your cards (round up) have any power')) return []

    const requiredAmount = Math.floor(fight.allCards.length / 2)
    const cardsWithZeroPower = this.ignoredHighest0Cards

    while (cardsWithZeroPower.length < requiredAmount) {
      let minPower = Infinity
      let minPowerCard

      fight.allCards.forEach(card => {
        //@ts-ignore
        if (cardsWithZeroPower.includes(card)) return
        if (card.powerInFight < minPower) {
          minPower = card.powerInFight
          minPowerCard = card
        }
      })

      cardsWithZeroPower.push(minPowerCard)
    }
    return cardsWithZeroPower
  },

  get agingCardLifeLoss() {
    let sum = 0;
    sum += fight.allCards.filter(card => card.agingEffectName === 'Life -1').length
    sum += fight.allCards.filter(card => card.agingEffectName === 'Life -2').length * 2
    return sum
  },

  get powerDifference() {
    const totalPower = fight.allCards.reduce((sum, card) => {
      //@ts-ignore
      if (fight.ignoredHighest0Cards.includes(card)) return sum
      //@ts-ignore
      if (fight.halfZeroPowerCards.includes(card)) return sum
      return sum + card.powerInFight
    }, 0)

    return totalPower - deckCenter.totalObstacle(fight.phase)
  },

  get hasFreeDraw() {
    return deckLeft.length < deckCenter.totalDraw
  },

  get freeDrawAvailable() {
    return this.hasFreeDraw && !this.isEffectStop
  },

  // utils

  get allCards() {
    return [...deckLeft.cards, ...deckRight.cards]
  },


}


//#region   CREATE ALL DECKS

const CARDS = createAllCards()
Object.freeze(CARDS)

// only used for setup
const deckAgingOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Old'))
const deckAgingVeryOld = new Deck(CARDS.filter(card => card.type === 'aging' && card.agingType === 'Very old'))

// created during setup
const deckFighting = new Deck(CARDS.filter(card => card.type === 'fighting'))
const deckHazard = new Deck(CARDS.filter(card => card.type === 'hazard'))
const deckPirates = new Deck(CARDS.filter(card => card.type === 'pirates'))
const deckAging = new Deck()

//purely for esthetics of the initial board
deckAging.addCards([...deckAgingOld.cards, ...deckAgingVeryOld.cards])

// created during the game
const deckFightingDiscard = new Deck()
const deckHazardDiscard = new Deck()
const deckLeft = new Deck()
const deckCenter = new Deck()
const deckRight = new Deck()
const deckVision = new Deck()

//#endregion

//#region   PREPARE UI FOR THE GAME

UI.drawDecks()
UI.setButtonEvents()

UI.help('Help Robinson survive the hazards and 2 pirate ships!')
UI.showButtons(['#start-game']);


(async () => {
  try {
    if (await httpPing()) $('#start-game').innerText = `* ${$('#start-game').innerText} *`
  } catch { }
})()

//#endregion

//#region before game

function startGameClick() {
  UI.help('Choose difficulty level:')
  UI.showButtons(['#difficulty-1', '#difficulty-2', '#difficulty-3', '#difficulty-4'])
}

function setDifficultyClick(event) {

  // was there purely for esthetics of the initial screen
  deckAging.removeAllCards()

  deckFighting.shuffle()
  deckHazard.shuffle()
  deckAgingOld.shuffle() // ->
  deckAgingVeryOld.shuffle() // ->

  game.difficultyLevel = +event.target.dataset.level

  if (![1, 2, 3, 4].includes(game.difficultyLevel)) throw new Error(`Unexpected difficulty level: ${game.difficultyLevel}`)

  const cardVeryStupid = deckAgingOld.cards.find(card => card.name === 'Very stupid')

  if (game.difficultyLevel >= 1) {
    deckAgingOld.removeCard(cardVeryStupid) // aging cards = 10
    game.livesMax = 22
    game.lives = 20
  }
  if (game.difficultyLevel >= 2) {
    deckFighting.addCard(deckAgingOld.drawCard('random')) // aging cards = 10
  }
  if (game.difficultyLevel >= 3) {
    deckAgingOld.addCard(cardVeryStupid) // aging cards = 11
  }
  if (game.difficultyLevel === 4) {  // aging cards = 11
    game.livesMax = 20
    game.lives = 18
  }

  deckAging.addCards(deckAgingVeryOld.removeAllCards()) // <-
  deckAging.addCards(deckAgingOld.removeAllCards())  // <-

  while (deckPirates.length > 2) {
    deckPirates.drawCard('random')
  }

  game.nextPhase()
  UI.hideAllButtons()
  chooseAHazard()
}

//#endregion

//#region before fight

function chooseAHazard() {
  if (game.phase === 'pirates') {
    if (deckPirates.length >= 2) {
      chooseAPirate()
      return
    }
    if (deckPirates.length === 1) {
      fightLastPirate()
      return
    }
    if (deckPirates.length === 0) {
      game.gameOver('survived')
      return
    }
  }

  if (deckHazard.length === 0) {
    deckHazardDiscard.shuffle()
    deckHazard.addCards(deckHazardDiscard.removeAllCards())
    game.nextPhase()
    chooseAHazard()
    return
  }

  if (deckHazard.length === 1) {
    const card1 = deckHazard.drawCard()
    deckCenter.addCard(card1)

    UI.help(`Choose whether you want to find the last remaining hazard in the deck`)
    UI.showButtons(['#fight-hazard', "#discard-hazard"])
    UI.drawDecks()
    return
  }

  const card1 = deckHazard.drawCard()
  const card2 = deckHazard.drawCard()
  deckCenter.addCard(card1)
  deckCenter.addCard(card2)

  UI.help(`Choose 1 hazard card`)
  UI.hideAllButtons()
  UI.drawDecks()

  UI.removeAllEvents()
  UI.addCardEvent(card1, hazardChosenClick)
  UI.addCardEvent(card2, hazardChosenClick)
}

function chooseAPirate() {
  deckCenter.addCards(deckPirates.removeAllCards())

  UI.help(`Choose which pirate ship you would like to fight first`)
  UI.hideAllButtons()
  UI.drawDecks()
  UI.removeAllEvents()
  deckCenter.cards.forEach(card => UI.addCardEvent(card, pirateChosenClick))
}

function pirateChosenClick(event) {
  const cardId = UI.findCardId(event.target)
  const index = deckCenter.cards.findIndex(card => card.id === cardId)
  const removeIndex = index === 0 ? 1 : 0
  const cardToRemove = deckCenter.cards[removeIndex]

  deckPirates.addCard(deckCenter.removeCard(cardToRemove))

  fightingDeckClick()
}

function fightLastPirate() {
  deckCenter.addCard(deckPirates.drawCard())
  fightingDeckClick()
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
  fightingDeckClick()
}

function discardHazardClick() {
  deckHazardDiscard.addCards(deckCenter.removeAllCards())
  chooseAHazard()
}

//#endregion

//#region during fight

function fightingDeckClick() {
  // pirate modifiers //

  const pirateCardBeatUnbeaten = deckCenter.cards.find(card => card.pirateEffectName === 'You have to beat all unbeaten danger cards at once')
  if (pirateCardBeatUnbeaten) {
    // option 1 - do as the game tells you, but be aware that the scoring will not work correctly
    // deckCenter.removeCard(pirateCardBeatUnbeaten)
    // deckCenter.addCards(deckHazard.removeAllCards())
    // deckCenter.addCards(deckHazardDiscard.removeAllCards())

    // option 2 - convert points from hazard cards to the pirate card
    pirateCardBeatUnbeaten.power = [...deckHazard.cards, ...deckHazardDiscard.cards].reduce((sum, card) => sum + card.phaseRed, 0) // overriding original value. Not good
    pirateCardBeatUnbeaten.draw = [...deckHazard.cards, ...deckHazardDiscard.cards].reduce((sum, card) => sum + card.draw, 0)      // overriding original value. Not good
  }

  const pirateCardPowerX = deckCenter.cards.find(card => card.pirateEffectName === 'Power X is number of aging cards added to game x2')
  if (pirateCardPowerX) {
    const startAmount = game.difficultyLevel >= 3 ? 11 : 10
    pirateCardPowerX.power = (startAmount - deckAging.length) * 2 // overriding original value. Not good
  }

  //regular action //

  if (deckFighting.length === 0) {
    fightingDeckRestock()
    fightingDeckClick()
    return
  }

  if (fight.freeDrawAvailable) {
    deckLeft.addCard(deckFighting.drawCard())
  } else {
    game.lives--
    if (deckCenter.cards.find(card => card.pirateEffectName === 'Each extra card drawn costs 2 life instead of 1')) game.lives--
    if (game.isGameOver) return // Fail safe. Not good.

    deckRight.addCard(deckFighting.drawCard())
  }

  UI.updateInterfaceForFight()
}

function fightingDeckRestock() {
  if (deckAging.length === 0) {
    game.gameOver("old age")
    return
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
      if (fight.phase === 'green' || game.phase === 'pirates') return
      fight.phaseIndexAdditional--
      cardClicked.skillUsed = true
      UI.updateInterfaceForFight()
      break

    case 'Double':
      const cardsToApplyEffectOn = fight.allCards.filter(card => {
        if (card.id === cardClicked.id) return false
        if (card.effectDouble) return false
        if (card.powerInFight <= 0) return false
        return true
      })

      if (cardsToApplyEffectOn.length === 0) return

      cardClicked.skillUsed = true

      UI.help(`Choose a card to apply 'Double' effect`)
      UI.hideAllButtons()

      UI.removeAllEvents()
      cardsToApplyEffectOn.forEach(card => UI.addCardEvent(card, applyEffectDoubleClick))
      break

    case 'Exchange 1':
      if (deckFightingDiscard.length === 0) return
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      UI.help(`Choose a card to exchange with discard pile`)
      UI.hideAllButtons()

      UI.removeAllEvents()
      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, applyEffectExchange)
      })

      break;

    case 'Exchange 2':
      if (deckFightingDiscard.length === 0) return
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      UI.help(`Choose the 1st card to exchange with discard pile`)
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

      UI.help(`Choose a card to put under the fighting deck`)
      UI.hideAllButtons()

      UI.removeAllEvents()
      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, applyEffectPutUnderPile)
      })

      break

    case 'Destroy':
      if (fight.allCards.length <= 1) return

      cardClicked.skillUsed = true

      UI.help(`Choose a card to destroy`)
      UI.hideAllButtons()

      UI.removeAllEvents()
      fight.allCards.forEach(card => {
        if (card.id === cardClicked.id) return
        UI.addCardEvent(card, applyEffectDestroy)
      })

      break

    case 'Copy':
      const cardsToCopyFrom = fight.allCards.filter(card => {
        if (card.id === cardClicked.id) return false
        if (!card.skillName) return false
        return true
      })

      if (cardsToCopyFrom.length === 0) return

      UI.help(`Choose a card to copy it's effect`)
      UI.hideAllButtons()

      UI.removeAllEvents()
      cardsToCopyFrom.forEach(card => UI.addCardEvent(card, (event) => applyEffectCopy(event, cardClicked)))
      break

    case 'Vision':
      if (deckFighting.length === 0) return

      cardClicked.skillUsed = true

      UI.help(`You can take up to 3 cards from the Fighting pile`)
      UI.hideAllButtons()

      UI.removeAllEvents()
      UI.addDeckFightingEvent(applyEffectVisionTakeCardClick)
      break

    case undefined:
      break;

    default:
      throw new Error(`Unexpected card skill name: ${cardClicked.skillName}`)
  }
}

// vision - start

function applyEffectVisionTakeCardClick() {
  if (deckFighting.length === 0 || deckVision.length === 3) return

  deckVision.addCard(deckFighting.drawCard('top'))

  UI.drawDecks()
  UI.showButtons(['#vision-stop-taking-cards'])

  if (deckFighting.length === 0 || deckVision.length === 3) {
    applyEffectVisionMakeChoice()
  } else {
    UI.addDeckFightingEvent(applyEffectVisionTakeCardClick)
  }
}

function visionStopTakingCardsClick() {
  applyEffectVisionMakeChoice()
}

function applyEffectVisionMakeChoice() {
  if (deckVision.length === 0) {
    UI.updateInterfaceForFight()
    return
  }

  UI.help('Choose whether you want to discard 1 card or not')
  UI.showButtons(['#vision-discard-a-card', '#vision-discard-no-cards'])

  UI.drawDecks()
  UI.removeAllEvents()
}

function visionDiscardACardClick() {
  UI.help('Choose 1 card to discard')
  UI.hideAllButtons()

  UI.removeAllEvents()
  deckVision.cards.forEach(card => UI.addCardEvent(card, applyEffectVisionDiscard))
}

function applyEffectVisionDiscard(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  deckFightingDiscard.addCard(deckVision.removeCard(card))

  visionDiscardNoCardsClick()
}

function visionDiscardNoCardsClick() {
  if (deckVision.length === 0) {
    UI.updateInterfaceForFight()
    return
  }

  UI.help('Put the remaining cards back to the Fighting deck in the order of your choice')
  UI.hideAllButtons()
  UI.drawDecks()

  UI.removeAllEvents()
  deckVision.cards.forEach(card => UI.addCardEvent(card, applyEffectVisionPutBack))
}

function applyEffectVisionPutBack(event) {
  const [card, deck] = UI.findCardAndDeck(event.target)

  deckFighting.addCard(deckVision.removeCard(card), 'top')

  if (deckVision.length > 0) {
    visionDiscardNoCardsClick()
  } else {
    UI.updateInterfaceForFight()
  }
}

// vision - end

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

  UI.help(`Choose the 2nd card to exchange with discard pile or click 'Stop exchanging'`)
  UI.showButtons(['#stop-exchanging'])
  UI.drawDecks()

  UI.removeAllEvents()
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
  fight.calculateLivesLostThisFight()
  game.lives = game.lives - fight.livesLostThisFight - fight.agingCardLifeLoss
  if (game.isGameOver) return // Fail safe. Not good

  const won = fight.livesLostThisFight === 0

  if (won) {
    fight.removeAllModifications()

    deckCenter.cards.forEach(card => {
      if (card.type === 'pirates') deckCenter.removeCard(card)
      card.fightingSide = true
    })

    deckFightingDiscard.addCards(deckCenter.removeAllCards())
    deckFightingDiscard.addCards(deckLeft.removeAllCards())
    deckFightingDiscard.addCards(deckRight.removeAllCards())

    UI.removeAllEvents()
    UI.hideAllButtons()
    chooseAHazard() // loops

  } else {
    if (game.phase === 'pirates') {
      game.gameOver("lost to pirates")
      return
    }
    UI.help(`Go to next fight or remove your played fighting cards for health points lost during this fight`)
    UI.showButtons(['#next-fight'])

    UI.removeAllEvents()
    fight.allCards.forEach(card => UI.addCardEvent(card, destroyCardForHealth))
  }

}

//#endregion

//#region after fight

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

//#region after game

function playAgainClick() {
  location.reload()
}



//#endregion

