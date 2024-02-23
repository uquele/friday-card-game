'use strict'

class Test {
  constructor({a, b}) {
    console.log([...Object.values(arguments[0])].every(arg => arg > 0))
    this.a = a,
    this.b = b
  }
}

const obj = {a: 1, b: -2}

const t = new Test(obj)