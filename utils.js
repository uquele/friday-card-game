'use strict'
//@ts-check


/**
 * 
 * @param {String} TSVString - first row must contain the names of columns to be used as object keys
 * @returns {Array}
 */

function parseTSV(TSVString) {
  const rows = TSVString.split('\n')
  const table = rows.map(row => row.split('\t'))
  const parsed = []

  for (let rowNumber = 1; rowNumber < table.length; rowNumber++) {

    const obj = {}
    for (let columnNumber = 0; columnNumber < table[rowNumber].length; columnNumber++) {
      const key = table[0][columnNumber]
      const value = table[rowNumber][columnNumber]
      obj[key] = value
    }
    parsed.push(obj)

  }

  return parsed
}