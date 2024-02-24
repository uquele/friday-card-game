
export function cardHazardHTML(card, phase) {
  return `
<div class="card-hazard ${card.fightingSide ? 'card-as-fighting' : ''}" id="card${card.id}">
  <div class="half">
    <div class="hazard-half">
      <div class="hazard-name">${card.name}</div>
      <div class="free-draw">${card.draw + card.additionalDraw}</div>
      <div class="danger-levels">
        <div class="danger-red ${phase === 'red' ? '' : 'inactive'}">${card.phaseRed}</div>
        <div class="danger-yellow ${phase === 'yellow' ? '' : 'inactive'}">${card.phaseYellow}</div>
        <div class="danger-green ${phase === 'green' ? '' : 'inactive'}">${card.phaseGreen}</div>
      </div>
    </div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name ${card.skillUsed ? 'crossed' : ''}">${card.skillName}</div>` : ""}
      <div class="lives">${card.removeCost}</div>
      <div class="power">${card.power}</div>
    </div>
  </div>
</div>`
}
