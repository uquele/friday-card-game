/**
 * 
 * @param {number} n 
 * @returns { 'st' | 'nd' | 'rd' | 'th' }
 */
function th(n) {
  const last1 = n % 10
  const last2 = n % 100
  if (last1 === 1 && last2 !== 11) return 'st'
  if (last1 === 2 && last2 !== 12) return 'nd'
  if (last1 === 3 && last2 !== 13) return 'rd'
  return 'th'
}

module.exports = th