/**
 * 
 * @param {Date} dateObj 
 * @returns {string} "1999-02-27 03:12:49"
 */
function formattedDate(dateObj) {
  const date = dateObj; // Use new Date() for the current date or new Date("2024-02-23T12:43:54") for a specific date

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add  1 to get the correct month number and pad with  0
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = formattedDate