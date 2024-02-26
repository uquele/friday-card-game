import { Card } from "./card.js"

export class Deck {
  /**
   * 
   * @param {Card[]} cardsArray
   */
  constructor(cardsArray = []) {
    if (!Array.isArray(cardsArray)) throw new TypeError(`Array of cards was expected as input. Received: ${cardsArray}`)
    this.cards = cardsArray // 1st element is bottom of the deck
  }

  get length() {
    return this.cards.length
  }

  get totalPower() {
    return this.cards.reduce((sum, card) => sum + card.powerModified, 0)
  }

  get totalDraw() {
    return this.cards.reduce((sum, card) => sum + card.drawModified, 0)
  }

  totalObstacle(phase) {
    const phaseMap = new Map([
      ['green', 'phaseGreen'],
      ['yellow', 'phaseYellow'],
      ['red', 'phaseRed'],
    ])
    const phaseColor = phaseMap.get(phase)

    const total = this.cards.reduce((sum, card) => {
      if (card.type === 'pirates') return sum + card.power
      return sum + card[phaseColor]
    }, 0)

    return total
  }

  findCardById(id) {
    id = +id
    const card = this.cards.find(card => card.id === id)
    if (!card) throw new Error(`Card with id ${id} not found`)
    return card
  }

  findIndex(card) {
    return this.cards.findIndex(c => c === card)
  }

  shuffle() {
    const deck = this.cards
    for (let i = deck.length - 1; i >= 0; i--) {
      let random = randomInt(0, deck.length - 1);
      [deck[i], deck[random]] = [deck[random], deck[i]]
    }
  }

  /**
   * Removes a card from the deck from the specified location
   * @param {'top' | 'bottom' | 'random' | 'random-except-top'} location 
   * @returns {Card} drawn card
   */
  drawCard(location = 'top') {
    const deck = this.cards
    let index

    if (this.length === 0) throw new Error(`Trying to draw a card from an empty deck`)

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
      case 'random-except-top':
        if (deck.length === 1) index = 0
        index = randomInt(0, deck.length - 2)
        break
      default:
        throw new TypeError(`Unexpected location: ${location}`)
    }

    const drawnCard = deck.splice(index, 1)[0];
    return drawnCard;

  }

  /**
   * 
   * @param {Card} card 
   * @param {'top' | 'bottom' | 'random' | number} index 
   */
  addCard(card, index = 'top') {
    const deck = this.cards

    if (Number.isInteger(index)) {
      //@ts-ignore
      deck.splice(index, 0, card)
      return
    }

    switch (index) {
      case 'top':
        deck.push(card)
        break
      case 'bottom':
        deck.unshift(card)
        break
      case 'random':
        let index = randomInt(0, deck.length - 1)
        deck.splice(index, 0, card)
        break
      default:
        throw new TypeError(`Unexpected index: ${index}`)
    }
  }

   /**
   * 
   * @param {Card[]} cards
   * @param {'top' | 'bottom' | 'random' | number} index 
   */
  addCards(cards, index = 'top') {
    for (const card of cards) {
      this.addCard(card, index)
    }
  }

  /**
   * 
   * @param {Card} cardToRemove 
   */
  removeCard(cardToRemove) {
    const deck = this.cards
    const index = deck.findIndex(card => card === cardToRemove)
    if (index === -1) console.error(`Card was not removed as it doesn't exist in the deck. Card to remove: ${cardToRemove}, Deck: ${deck}`)
    const removedCard = deck.splice(index, 1)[0]
    if (removedCard !== cardToRemove) throw new Error(`Removed card is not the same as the one which should be removed. Card to remove: ${cardToRemove.id}, removed card: ${removedCard.id}`)
    return removedCard
  }

  removeAllCards() {
    const removedCards = this.cards.splice(0, this.length)
    if (this.length !== 0) throw new Error('Some cards were not removed')
    return removedCards
  }

}

// uses

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}