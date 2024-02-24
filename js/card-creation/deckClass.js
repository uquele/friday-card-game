export class Deck {
  constructor(cardsArray = []) {
    if (!Array.isArray(cardsArray)) cardsArray = [cardsArray]
    this.cards = cardsArray // 1st element is bottom of the deck
  }

  get length() {
    return this.cards.length
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
  drawCard(location) {
    const deck = this.cards
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
  addCard(card, location) {
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

  /**
   * 
   * @param {Card} cardToRemove 
   */
  removeCard(cardToRemove) {
    const deck = this.cards
    const index = deck.findIndex(card => card === cardToRemove)
    if (index === -1) console.error(`Card was not removed as it doesn't exist in the deck. Card to remove: ${cardToRemove}, Deck: ${deck}`)
    deck.splice(index, 1)
  }

}

// uses

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}