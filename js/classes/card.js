export class Card {
  constructor(cardObject) {
    setCorrectTypes(cardObject)
    checkCorrectnessOfInputValues(cardObject)

    let { id, type, name, power, skillName, removeCost, phaseGreen, phaseYellow, phaseRed, draw, agingType, agingEffectName, pirateEffectName } = cardObject

    this.id = id
    this.type = type
    this.name = name
    this.power = power === 'X' ? 'X' : power

    this._skillName = skillName
    this.removeCost = removeCost

    this.phaseGreen = phaseGreen
    this.phaseYellow = phaseYellow
    this.phaseRed = phaseRed
    this.draw = draw === 'X' ? 'X' : draw

    this.agingType = agingType
    this.agingEffectName = agingEffectName

    this.pirateEffectName = pirateEffectName

    // persistent modifications
    this.fightingSide = false

    // modifications during fight only
    this.skillUsed = false
    this.additionalDraw = 0
    this.effectDouble = false
    this.copiedSkillName = undefined


    function setCorrectTypes(cardObject) {
      for (const key in cardObject) {
        cardObject[key] = setCorrectType(cardObject[key])
      }

      function setCorrectType(value) {
        if (value === '') return undefined
        if (Number.isInteger(+value)) return +value
        return value
      }
    }

    function checkCorrectnessOfInputValues(card) {

      class CardError extends TypeError {
        constructor(message) {
          super(`${message}. Card id: ${card.id}`)
        }
      }

      if (!Number.isInteger(card.id)) throw new CardError(`Card id is not an integer`)

      switch (card.type) {
        case 'fighting':
        case 'hazard':
        case 'aging':
        case 'pirates':
          break;
        default:
          throw new TypeError(`Unknown card type: ${card.type}`)
      }

      if (!card.name) throw new CardError(`Card does not have a name`)

      if (!(Number.isInteger(card.power) || card.power === 'X')) throw new CardError(`Card's power is not an interger or an "X"`)

      if (card.skillName) {
        if (card.type !== 'fighting' && card.type !== 'hazard') throw new CardError(`Card should not have a skillName`)
      }

      // undefined must be used here and below as the value can be 0
      if (card.removeCost !== undefined) {
        if (card.type === 'pirate') throw new CardError(`A pirate card should not have a removeCost`)
        if (!Number.isInteger(card.removeCost)) throw new CardError(`Remove cost must be an integer`)
      } else if (card.type === 'fighting' || card.type === 'hazard' || card.type === 'aging') throw new CardError(`Card must have a removeCost`)

      if (card.phaseGreen !== undefined || card.phaseYellow !== undefined || card.phaseRed !== undefined) {
        if (card.type !== 'hazard') throw new CardError(`Card should not have a phase value`)
        if (!(card.phaseGreen !== undefined && card.phaseYellow !== undefined && card.phaseRed !== undefined)) throw new CardError(`Card should have all phase values set`)
        if (!Number.isInteger(card.phaseGreen) || !Number.isInteger(card.phaseYellow) || !Number.isInteger(card.phaseRed)) throw new CardError(`Phase value must be an integer`)
      } else if (card.type === 'hazard') throw new CardError(`Card must have phase values`)

      if (card.draw !== undefined) {
        if (card.type === 'hazard' && !Number.isInteger(card.draw)) throw new CardError(`Card's draw should have an integer value`)
        if (card.type === 'pirates' && !(Number.isInteger(card.draw) || card.draw === 'X')) throw new CardError(`Card's draw should have an integer value or be an "X"`)
        if (card.type === 'fighting' || card.type === 'aging') throw new CardError(`Card should not have a draw value`)
      } else if (card.type === 'hazard' || card.type === 'pirates') throw new CardError(`Card must have a draw value`)

      if (card.agingType) {
        if (card.agingType !== 'Old' && card.agingType !== 'Very old') throw new CardError(`Aging card has wrong agingType`)
        if (card.type !== 'aging') throw new CardError(`Card should not have agingType`)
      } else if (card.type === 'aging') throw new CardError(`Card must have agingType`)

      if (card.agingEffectName) {
        if (card.type !== 'aging') throw new CardError(`Card should not have agingEffectName`)
      }

    }
  }

  get powerModified() {
    if (this.power === 'X') throw new TypeError(`Trying to double the power of card, but card's power is "X"`)
    //@ts-ignore
    return this.effectDouble ? this.power * 2 : this.power
  }

  get drawModified() {
    if (this.draw === 'X') throw new TypeError(`Card's draw is "X". Can't add ingeter to "X"`)
    return this.draw + this.additionalDraw
  }

  get skillName() {
    return this.copiedSkillName || this._skillName
  }

  removeModifications() {
    this.skillUsed = false
    this.additionalDraw = 0
    this.effectDouble = false
    this.copiedSkillName = undefined
  }


}


/*

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

*/