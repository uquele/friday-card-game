import { CARDS_TSV } from "../input-data/cardsTSV.js"
import { parseTSV } from "./parseTSV.js"
import { Card } from "../classes/card.js"


export function createAllCards() {
  const cardObjects = parseTSV(CARDS_TSV)
  const cards = []

  cardObjects.forEach(card => cards.push(new Card(card)))

  return cards
}