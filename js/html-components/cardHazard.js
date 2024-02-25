
export function cardHazardHTML({ card, phaseInFight, ignoredMaxPowerCards = [], isStop }) {
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
