export function cardFightingHTML(card) {
  return `
<div class="card-hazard card-as-fighting card-fighting">
  <div class="half">
    <div class="fighting-half"></div>
  </div>

  <div class="half">
    <div class="fighting-half">
      ${card.skillName ? `<div class="effect-name">${card.skillName}</div>` : ""}
      <div class="lives">${card.removeCost}</div>
      <div class="power">${card.power}</div>
      <div class="mood">${card.name}</div>
    </div>
  </div>
</div>`
}