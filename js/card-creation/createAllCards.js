//@ts-check

import { CARDS_TSV } from "../input-data/cardsTSV.js"
import { parseTSV } from "./parseTSV.js"
import { CardFighting, CardHazard, CardAging, CardPirates } from "../cardClasses/cardClasses.js"

/**
 * @typedef {CardAging | CardFighting | CardHazard | CardPirates} Card
 */

/**
 * 
 * @returns {Card[]}
 */
export function createAllCards() {
  const cards = []

  const cardsRaw = parseTSV(CARDS_TSV)

  cardsRaw.forEach((card) => {
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