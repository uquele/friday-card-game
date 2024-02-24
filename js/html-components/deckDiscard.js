export function deckDiscardHTML(deck, {displayName, id}) {
  return `
  <div class="deck deck-discard" id="${id}">
    <div class="deck-name">${displayName}</div>
    <div class="deck-name deck-name-discard">Discard</div>
    <div class="cards-in-deck">${deck.length}</div>        
  </div>`
}
