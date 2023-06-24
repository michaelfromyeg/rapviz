/**
 * Shuffles array in place.
 *
 * @param {Array} array items An array containing the items.
 */
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let x = array[i];
    array[i] = array[j];
    array[j] = x;
  }

  return array;
}
