function cardFightingHTML({ card, ignoredMaxPowerCards}) {
  return `
<div class="card-hazard card-as-fighting card-fighting" id="card${card.id}">
  <div class="half">
    <div class="fighting-half"></div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      ${card.agingEffectName ? `<div class="effect-name effect-aging">${card.agingEffectName}</div>` : ""}
      <div class="lives">${card.removeCost}</div>
      <div class="power ${card.effectDouble ? 'doubled' : ''} ${ignoredMaxPowerCards.includes(card) ? 'crossed' : ''}">${card.effectDouble ? card.power * 2 : card.power}</div>
      <div class="mood">${card.name}</div>
    </div>
  </div>
</div>`
}

function cardHazardHTML({ card, phaseInFight, ignoredMaxPowerCards, isStop }) {
  return `
<div class="card-hazard ${card.fightingSide ? 'card-as-fighting' : ''}" id="card${card.id}">
  <div class="half">
    <div class="hazard-half">
      <div class="hazard-name">${card.name}</div>
      <div class="free-draw ${isStop ? 'crossed' : ''}">${card.draw + card.additionalDraw}</div>
      <div class="danger-levels">
        <div class="danger-red ${phaseInFight === 'red' ? '' : 'inactive'}">${card.phaseRed}</div>
        <div class="danger-yellow ${phaseInFight === 'yellow' ? '' : 'inactive'}">${card.phaseYellow}</div>
        <div class="danger-green ${phaseInFight === 'green' ? '' : 'inactive'}">${card.phaseGreen}</div>
      </div>
    </div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      <div class="lives">${card.removeCost}</div>
      <div class="power ${card.effectDouble ? 'doubled' : ''} ${ignoredMaxPowerCards.includes(card) ? 'crossed' : ''}">${card.effectDouble ? card.power * 2 : card.power}</div>
    </div>
  </div>
</div>`
}

function cardHTML({ card, phaseInFight, ignoredMaxPowerCards, isStop }) {
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

export function deckOpenHTML({ deck, phaseInFight = '', ignoredMaxPowerCards = [], isStop = false }) {
  return deck.cards.reduce((html, card) => html + cardHTML({ card, phaseInFight, ignoredMaxPowerCards, isStop }), "")
}

export function deckClosedHTML(deck, {displayName, id}) {
  return `
<div class="deck" id="${id}">
  <div class="deck-name">${displayName}</div>
  <div class="cards-in-deck">${deck.length}</div>
</div>`
}

export function deckDiscardHTML(deck, {displayName, id}) {
  return `
  <div class="deck deck-discard" id="${id}">
    <div class="deck-name">${displayName}</div>
    <div class="deck-name deck-name-discard">Discard</div>
    <div class="cards-in-deck">${deck.length}</div>        
  </div>`
}
