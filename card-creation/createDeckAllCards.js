import { CARDS_TSV } from "./cardsTSV.js"
import { CardFighting, CardHazard, CardAging, CardPirates } from "./cardClasses.js"


export function createDeckAllCards() {
  const cards = []

  CARDS_TSV.forEach((card) => {
    let newCard

    switch (card.type) {
      case 'fighting':
        newCard = new CardFighting(card)
        break;
      case 'hazard':
        newCard = new CardHazard(card)
        break;
      case 'aging':
        newCard = new CardAging(card)
        break;
      case 'pirates':
        newCard = new CardPirates(card)
        break;
      default:
        throw new TypeError(`Unknown card type: ${card.type}`)
    }

    cards.push(newCard)
  })

  return cards
}