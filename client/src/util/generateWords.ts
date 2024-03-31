import { shuffle } from "./helpers";

const COLORS = [
  "#00FFFF", // aqua
  "#7FFFD4", // aquamarine
  "#0000FF", // blue
  "#8A2BE2", // blueviolet
  "#5F9EA0", // cadetblue
  "#7FFF00", // chartreuse
  "#FF7F50", // coral
  "#6495ED", // cornflowerblue
  "#DC143C", // crimson
  "#FF8C00", // darkorange
  "#FF00FF", // fuchsia
  "#FFD700", // gold
  "#DAA520", // goldenrod
  "#008000", // green
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
const generateRhymes = (lyrics: string, rhymes: string[][]): any => {
  const colors = shuffle(COLORS);

  if (!lyrics) {
    return [];
  }

  const wordData = [];
  const words = lyrics.replace(/  +/g, " y").split(/\n| /);
  const parsedWords = lyrics
    .toLowerCase()
    .replace(/[.,:?!;\-()']/g, "")
    .replace(/  +/g, " ")
    .split("\n")
    .map((arr: any) => arr.split(" "));

  let colorIndex = 0;
  let colorMap = rhymes.reduce((map: any, rhymeCluster: any) => {
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

let getWordData = (parsedWord: any, word: any, colors: any) => {
  for (let [color, rhymeCluster] of Object.entries(colors)) {
    if ((rhymeCluster as any).includes(parsedWord)) {
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
