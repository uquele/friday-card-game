import { cardFightingHTML } from "./cardFighting.js"
import { cardHazardHTML } from "./cardHazard.js"

export function cardHTML({ card, phaseInFight, ignoredMaxPowerCards, isStop }) {
  switch (card.type) {
    case 'fighting':
    case 'aging':
      return cardFightingHTML({ card, ignoredMaxPowerCards })
    case 'hazard':
      return cardHazardHTML({ card, phaseInFight, ignoredMaxPowerCards, isStop })
    default:
      throw new TypeError(`Card type ${card.type} not found`)
  }
}