export const healthIconHTML = `<img src="./css/health-icon.svg" alt=""></img>`

// HELP TEXT //

const title = {
  skill: "Card's ability. Can be used once every fight",
  agingEffect: "Aging effect. Will be resolved at the end of the fight",
  removeCost: "Remove cost. If you lose the fight, you lose your lives. You can use these lost lives to remove this card",
  power: "Card's power. In order to win a fight, the sum of cards' powers must be more than or equal to danger level",
  freeDraw: "The amount of cards you can draw for free. After, you will pay 1 life per draw",
  dangerLevel: "Danger level. The sum of your cards' powers must be higher or equal to this. Current danger level is indicated by color",
  dangerLevelPirate: "Danger level. The sum of your cards' powers must be higher or equal to this to win the fight. If you lose to pirates, you lose the game",
  pirateEffect: "Pirate's special ability"
}
for (const name in title) {
  title[name] = `title="${title[name]}"`
}

// CARDS //

function cardFightingHTML({ card, fight }) {
  const crossedPower = fight?.ignoredHighest0Cards.includes(card) || fight?.halfZeroPowerCards.includes(card) ? 'crossed' : ''
  return `
<div class="card-hazard card-as-fighting card-fighting" id="card${card.id}">
  <div class="half">
    <div class="fighting-half"></div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div ${title.skill} class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      ${card.agingEffectName ? `<div ${title.agingEffect} class="effect-name effect-aging">${card.agingEffectName}</div>` : ""}
      <div ${title.removeCost} class="lives ${card.removeCost === 2 ? 'two' : ''}">${card.removeCost === 1 ? `${healthIconHTML}` : `${healthIconHTML}${healthIconHTML}`}</div>
      <div ${title.power} class="power ${card.effectDouble ? 'doubled' : ''} ${crossedPower}">${card.powerInFight}</div>
      <div class="mood">${card.name}</div>
    </div>
  </div>
</div>`
}

function cardHazardHTML({ card, fight }) {
  const crossedDraw = !card.fightingSide && fight?.isEffectStop ? 'crossed' : ''
  const used = card.fightingSide ? '' : !fight ? '' : fight.hasFreeDraw ? '' : 'used'
  const crossedPower = fight?.ignoredHighest0Cards.includes(card) || fight?.halfZeroPowerCards.includes(card) ? 'crossed' : ''
  return `
<div class="card-hazard ${card.fightingSide ? 'card-as-fighting' : ''}" id="card${card.id}">
  <div class="half">
    <div class="hazard-half">
      <div class="hazard-name">${card.name}</div>
      <div ${title.freeDraw} class="free-draw ${crossedDraw} ${used}">${card.draw + card.additionalDraw}</div>
      <div class="danger-levels">
        <div ${title.dangerLevel} class="danger-red ${fight?.phase === 'red' ? '' : 'inactive'}">${card.phaseRed}</div>
        <div ${title.dangerLevel} class="danger-yellow ${fight?.phase === 'yellow' ? '' : 'inactive'}">${card.phaseYellow}</div>
        <div ${title.dangerLevel} class="danger-green ${fight?.phase === 'green' ? '' : 'inactive'}">${card.phaseGreen}</div>
      </div>
    </div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div ${title.skill} class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      <div ${title.removeCost} class="lives ${card.removeCost === 2 ? 'two' : ''}">${card.removeCost === 1 ? `${healthIconHTML}` : `${healthIconHTML}${healthIconHTML}`}</div>
      <div ${title.power} class="power ${card.effectDouble ? 'doubled' : ''} ${crossedPower}">${card.powerInFight}</div>
    </div>
  </div>
</div>`
}

function cardPirateHTML({ card, fight }) {
  const crossedDraw = fight?.isEffectStop ? 'crossed' : ''
  const used = !fight ? '' : fight.hasFreeDraw ? '' : 'used'
  return `
    <div class="card-pirate" id="card${card.id}">
      <div class="inner">
        <div class="inner-top">
          <div class="card-name">${card.name}</div>
          <div ${title.freeDraw} class="free-draw ${crossedDraw} ${used}">${card.draw === 'X' ? 'X' : card.draw + card.additionalDraw}</div>
          <div ${title.dangerLevelPirate} class="danger">${card.power}</div>
        </div>
        <div class="inner-bottom">
          <div ${title.pirateEffect} class="pirate-effect-name">${card.pirateEffectName === 'none' ? '...' : card.pirateEffectName}</div>
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

// DECKS //

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

