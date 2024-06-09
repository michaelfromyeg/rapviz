/**
 * Shuffles array in place.
 *
 * @param {T[]} array - An array containing the items.
 * @returns {T[]} - The shuffled array.
 */
export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = array[i];
    array[i] = array[j];
    array[j] = x;
  }

  return array;
};

export function formatMillisecond(ms: number): string {
  const minute = Math.floor(ms / 1000 / 60);
  const second = Math.floor(ms / 1000) % 60;
  const millisecond = ms % 1000;
  return `${minute.toString().padStart(2, "0")}:${second
    .toString()
    .padStart(2, "0")}.${millisecond.toString().padStart(3, "0")}`;
}
