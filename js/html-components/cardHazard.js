
export function cardHazardHTML(card) {
  return `
<div class="card-hazard" id="${card.id}">
  <div class="half">
    <div class="hazard-half">
      <div class="hazard-name">${card.name}</div>
      <div class="free-draw">${card.draw}</div>
      <div class="danger-levels">
        <div class="danger-red">${card.phaseRed}</div>
        <div class="danger-yellow">${card.phaseYellow}</div>
        <div class="danger-green">${card.phaseGreen}</div>
      </div>
    </div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name">${card.skillName}</div>` : ""}
      <div class="lives">${card.removeCost}</div>
      <div class="power">${card.power}</div>
    </div>
  </div>
</div>`
}
