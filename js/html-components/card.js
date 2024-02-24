import { cardFightingHTML } from "./cardFighting.js"
import { cardHazardHTML } from "./cardHazard.js"

export function cardHTML(card, phase) {
  switch (card.type) {
    case 'fighting':
    case 'aging':
      return cardFightingHTML(card)
    case 'hazard':
      return cardHazardHTML(card, phase)
    default:
      throw new TypeError(`Card type ${card.type} not found`)
  }
}