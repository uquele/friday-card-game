export const healthIconHTML = `<img src="./css/health-icon.svg" alt=""></img>`

function cardFightingHTML({ card, fight }) {
  return `
<div class="card-hazard card-as-fighting card-fighting" id="card${card.id}">
  <div class="half">
    <div class="fighting-half"></div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      ${card.agingEffectName ? `<div class="effect-name effect-aging">${card.agingEffectName}</div>` : ""}
      <div class="lives ${card.removeCost === 2 ? 'two' : ''}">${card.removeCost === 1 ? `${healthIconHTML}` : `${healthIconHTML}${healthIconHTML}`}</div>
      <div class="power ${card.effectDouble ? 'doubled' : ''} ${fight?.ignoredHighest0Cards.includes(card) || fight?.halfZeroPowerCards.includes(card) ? 'crossed' : ''}">${card.powerInFight}</div>
      <div class="mood">${card.name}</div>
    </div>
  </div>
</div>`
}

function cardHazardHTML({ card, fight }) {
  return `
<div class="card-hazard ${card.fightingSide ? 'card-as-fighting' : ''}" id="card${card.id}">
  <div class="half">
    <div class="hazard-half">
      <div class="hazard-name">${card.name}</div>
      <div class="free-draw ${fight?.isEffectStop ? 'crossed' : ''}">${card.draw + card.additionalDraw}</div>
      <div class="danger-levels">
        <div class="danger-red ${fight?.phase === 'red' ? '' : 'inactive'}">${card.phaseRed}</div>
        <div class="danger-yellow ${fight?.phase === 'yellow' ? '' : 'inactive'}">${card.phaseYellow}</div>
        <div class="danger-green ${fight?.phase === 'green' ? '' : 'inactive'}">${card.phaseGreen}</div>
      </div>
    </div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      <div class="lives ${card.removeCost === 2 ? 'two' : ''}">${card.removeCost === 1 ? `${healthIconHTML}` : `${healthIconHTML}${healthIconHTML}`}</div>
      <div class="power ${card.effectDouble ? 'doubled' : ''} ${fight?.ignoredHighest0Cards.includes(card) || fight?.halfZeroPowerCards.includes(card) ? 'crossed' : ''}">${card.powerInFight}</div>
    </div>
  </div>
</div>`
}

function cardPirateHTML({ card, fight }) {
  return `
    <div class="card-pirate" id="card${card.id}">
      <div class="inner">
        <div class="inner-top">
          <div class="card-name">${card.name}</div>
          <div class="free-draw ${fight?.isEffectStop ? 'crossed' : ''}">${card.draw === 'X' ? 'X' : card.draw + card.additionalDraw}</div>
          <div class="danger">${card.power}</div>
        </div>
        <div class="inner-bottom">
          <div class="pirate-effect-name">${card.pirateEffectName}</div>
        </div>
      </div>
    </div>
  `
}

function cardHTML({ card, fight }) {
  switch (card.type) {
    case 'fighting':
    case 'aging':
      return cardFightingHTML({ card, fight })
    case 'hazard':
      return cardHazardHTML({ card, fight })
    case 'pirates':
      return cardPirateHTML({ card, fight })
    default:
      throw new TypeError(`Card type ${card.type} not found`)
  }
}

export function deckOpenHTML(deck, htmlId, fight) {
  htmlId = htmlId.slice(1)
  const cardsHTML = deck.cards.reduce((html, card) => html + cardHTML({ card, fight }), "")
  return `
    <div id="${htmlId}">
      ${cardsHTML}
    </div>
  `
}

export function deckClosedHTML(deck, htmlId, displayName) {
  htmlId = htmlId.slice(1)
  const veryLow = deck.htmlId === 'js-deck-aging' && deck.length === 0
  return `
    <div class="deck" id="${htmlId}">
      <div class="deck-name">${displayName}</div>
      <div class="cards-in-deck ${veryLow ? 'very-low' : ''}">${deck.length}</div>
    </div>
`
}

export function deckClosedDiscardHTML(deck, htmlId, displayName) {
  htmlId = htmlId.slice(1)
  return `
    <div class="deck deck-discard" id="${htmlId}">
      <div class="deck-name">${displayName}</div>
      <div class="deck-name deck-name-discard">Discard</div>
      <div class="cards-in-deck">${deck.length}</div>        
    </div>
  `
}

