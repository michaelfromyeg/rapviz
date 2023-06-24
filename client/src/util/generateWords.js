import { shuffle } from "./helpers";

const COLORS = [
  "aqua",
  "aquamarine",
  "blue",
  "blueviolet",
  "cadetblue",
  "chartreuse",
  "coral",
  "cornflowerblue",
  "crimson",
  "darkorange",
  "fuchsia",
  "gold",
  "goldenrod",
  "green",
];

/**
 * Returns a 2d array, a list of data containing words and their hex color for each line of the song.
 * Words that rhyme should have the same color, and words that are not part of any rhyming group
 * should have a color of "inherit".
 *
 * Example
 * Input
 * "ten men die
 *  good bye"
 * Output
 * [
 *  [
 *   {color: "#972f0f", text: "ten"},
 *   {color: "#972f0f", text: "men"},
 *   {color: "#5e232d", text: "die"}
 *  ],
 * [
 *  [
 *   {color: "inherit", text: "good"},
 *   {color: "#5e232d", text: "bye"}
 *  ]
 * ]
 *
 * @param {string} lyrics - song lyrics
 * @param {string[][]} rhymes - a list of rhyming words
 * @returns {Object[][]} - list of data containing words and their color for each line of the song
 */
const generateRhymes = (lyrics, rhymes) => {
  const colors = shuffle(COLORS);

  const wordData = [];
  const words = lyrics.replace(/  +/g, " y").split(/\n| /);
  const parsedWords = lyrics
    .toLowerCase()
    .replace(/[.,:?!;\-()']/g, "")
    .replace(/  +/g, " ")
    .split("\n")
    .map((arr) => arr.split(" "));

  let colorIndex = 0;
  let colorMap = rhymes.reduce((map, rhymeCluster) => {
    map[colors[colorIndex]] = rhymeCluster;
    colorIndex++;
    return map;
  }, {});

  let counter = 0;

  for (let line in parsedWords) {
    let arr = parsedWords[line];
    let lineData = [];

    for (let i in arr) {
      let parsedWord = parsedWords[line][i];
      let word = words[counter];

      lineData.push(getWordData(parsedWord, word, colorMap));
      counter++;
    }
    wordData.push(lineData);
  }

  return wordData;
};

let getWordData = (parsedWord, word, colors) => {
  for (let [color, rhymeCluster] of Object.entries(colors)) {
    if (rhymeCluster.includes(parsedWord)) {
      // Contains rhyme
      return {
        color: color,
        text: word,
      };
    }
  }
  // doesnt contain rhyme
  return {
    color: "inherit",
    text: word,
  };
};

export default generateRhymes;
