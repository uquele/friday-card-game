export function cardRobinsonHTML(card) {
  return `
<div class="card-hazard card-as-robinson card-robinson">
  <div class="half">
    <div class="robinson-half"></div>
  </div>

  <div class="half">
    <div class="robinson-half">
      ${card.skillName ? `<div class="effect-name">${card.skillName}</div>` : ""}
      <div class="lives">${card.removeCost}</div>
      <div class="power">${card.power}</div>
      <div class="mood">${card.name}</div>
    </div>
  </div>
</div>`
}