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
let generateRhymes = (lyrics, rhymes) => {
  let wordData = [];
  let words = lyrics.replace(/  +/g, ' ').split(/\n| /);
  let parsedWords = lyrics.toLowerCase().replace(/[.,:?!;]/g, "").replace(/  +/g, ' ').split("\n").map(arr => arr.split(" "));

  let colors = rhymes.reduce((map, rhymeCluster) => {
    map[randomColor()] = rhymeCluster;
    return map;
  }, {})

  let counter = 0;
  for (let line in parsedWords) {
    let arr = parsedWords[line]
    let lineData = [];
    for (let i in arr) {
      let parsedWord = parsedWords[line][i];
      let word = words[counter];

      lineData.push(getWordData(parsedWord, word, colors));
      counter++;
    }
    wordData.push(lineData);
  }
  return wordData;
}

let getWordData = (parsedWord, word, colors) => {
  for (let [color, rhymeCluster] of Object.entries(colors)) {
    if(rhymeCluster.includes(parsedWord)) {
      // Contains rhyme
      return {
        color: color,
        text: word
      }
    }
  }
  // doesnt contain rhyme
  return {
    color: "inherit",
    text: word
  }
} 

let randomColor = () => "#"+Math.floor(Math.random()*16777215).toString(16);

export default generateRhymes; 