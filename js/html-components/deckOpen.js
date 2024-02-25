import { cardHTML } from "./card.js"

export function deckOpenHTML({ deck, phaseInFight, ignoredMaxPowerCards, isStop }) {
  // let html = ''

  // for (const card of deck.cards) {
  //   html = html + cardHTML(card)
  // }

  return deck.cards.reduce((html, card) => html + cardHTML({ card, phaseInFight, ignoredMaxPowerCards, isStop }), "")
}