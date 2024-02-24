export class Deck {
  constructor(cardsArray = []) {
    if (!Array.isArray(cardsArray)) cardsArray = [cardsArray]
    this.cards = cardsArray // 1st element is bottom of the deck
  }

  get length() {
    return this.cards.length
  }

  get totalPower() {
    return this.cards.reduce((sum, card) => sum + card.power, 0)
  }

  totalObstacle(phase) {
    const phaseMap = new Map([
      ['green', 'phaseGreen'],
      ['yellow', 'phaseYellow'],
      ['red', 'phaseRed'],
    ])
    const currentPhase = phaseMap.get(phase)
    return this.cards.reduce((sum, card) => sum + card[currentPhase], 0)
  }

  get totalDraw() {
    return this.cards.reduce((sum, card) => sum + card.draw + card.additionalDraw, 0)
  }
  
  findCardById(id) {
    id = +id
    const card = this.cards.find(card => card.id === id)
    if (!card) throw new Error(`Card with id ${id} not found`)
    return card
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
   * @param {'top' | 'bottom' | 'random'} location 
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
      default:
        throw new TypeError(`Unexpected location: ${location}`)
    }
  
    const drawnCard = deck.splice(index, 1)[0];
    return drawnCard;
  
  }

  /**
   * 
   * @param {Card} card 
   * @param {'top' | 'bottom' | 'random'} location 
   */
  addCard(card, location = 'top') {
    const deck = this.cards

    switch (location) {
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
        throw new TypeError(`Unexpected location: ${location}`)
    }
  }

  addCards(cards, location = 'top') {
    for (const card of cards) {
      this.addCard(card, location)
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