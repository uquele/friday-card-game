export function cardFightingHTML({ card, ignoredMaxPowerCards = [] }) {
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