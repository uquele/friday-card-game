export class CardFighting {
  constructor({ id, type, name, power, skillName, removeCost }) {
    checkForNoUndefinedValues(arguments[0])

    this.id = +id
    this.type = type
    this.name = name
    this.power = +power
    this.skillName = skillName
    this.removeCost = +removeCost

    this.skillUsed = false
    this.effectDouble = false
  }
}

export class CardAging {
  constructor({ id, type, name, power, removeCost, agingType, agingEffectName }) {
    checkForNoUndefinedValues(arguments[0])

    this.id = +id
    this.type = type
    this.name = name
    this.power = +power
    this.removeCost = +removeCost
    this.agingType = agingType
    this.agingEffectName = agingEffectName

    this.skillUsed = false
    this.effectDouble = false
  }
}

export class CardHazard {
  constructor({ id, type, name, power, skillName, removeCost, phaseGreen, phaseYellow, phaseRed, draw }) {
    checkForNoUndefinedValues(arguments[0])

    this.id = +id
    this.type = type
    this.name = name
    this.power = +power
    this._skillName = skillName
    this.removeCost = +removeCost
    this.phaseGreen = +phaseGreen
    this.phaseYellow = +phaseYellow
    this.phaseRed = +phaseRed
    this.draw = +draw

    this.fightingSide = false
    this.skillUsed = false
    this.additionalDraw = 0
    this.effectDouble = false
    this.copiedSkillName = undefined
  }

  get skillName() {
    return this.copiedSkillName || this._skillName
  }

  set skillName(name) {
    this._skillName = name
  }
}

export class CardPirates {
  constructor({ id, type, name, power, draw, pirateEffectName }) {
    checkForNoUndefinedValues(arguments[0])

    this.id = +id
    this.type = type
    this.name = name
    this.power = power === 'X' ? 'X' : +power
    this.draw = draw === 'X' ? 'X' : +draw
    this.pirateEffectName = pirateEffectName
  }
}

// uses

function checkForNoUndefinedValues(obj) {
  const isUndefined = [...Object.values(obj)].some(value => value === undefined)
  if (isUndefined) throw new TypeError(`Required parameter is undefined`)
}