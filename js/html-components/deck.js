export function deckHTML(deck, {displayName, id}) {
  return `
<div class="deck" id="${id}">
  <div class="deck-name">${displayName}</div>
  <div class="cards-in-deck">${deck.length}</div>
</div>`
}