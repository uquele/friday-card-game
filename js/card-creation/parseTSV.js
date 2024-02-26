/**
 * 
 * @param {String} TSVString First row must contain the names of columns to be used as object keys
 * @returns {object[]} An array of objects. An object represents a line in TSV
 */
export function parseTSV(TSVString) {
  const rows = TSVString.split('\n')
  const table = rows.map(row => row.split('\t'))
  const arr = []

  for (let row = 1; row < table.length; row++) {

    const obj = {}
    for (let col = 0; col < table[row].length; col++) {
      const key = table[0][col]
      const value = table[row][col]
      obj[key] = value
    }
    arr.push(obj)
  }

  return arr
}