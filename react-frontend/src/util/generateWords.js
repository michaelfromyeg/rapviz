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
  let words = lyrics.replace(/  +/g, ' y').split(/\n| /);
  let parsedWords = lyrics.toLowerCase().replace(/[.,:?!;\-()']/g, "").replace(/  +/g, ' ').split("\n").map(arr => arr.split(" "));

  let color = 0;
  let colors = rhymes.reduce((map, rhymeCluster) => {
    map[randomColor(color)] = rhymeCluster;
    color++;
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

let randomColor = (color) => {
  switch (color) {
    case 0: 
      return "#F7DC6F";
    case 1: 
      return "#82E0AA";
    case 2: 
      return "#E74C3C";
    case 3: 
      return "#9B59B6";
    case 4: 
      return "#5499C7";
    case 5: 
      return "#48C9B0";
    case 6: 
      return "#F5B041";
    case 7: 
      return "#5D6D7E";
    case 8: 
      return "#000000";
    case 9: 
      return "#EC7063";
    case 10:
      return "#45B39D";
    case 11:
      return "#E59866";
    case 12:
      return "#85C1E9";
    case 13:
      return "#641E16";
    case 14:
      return "#78281F";
    case 15:
      return "#512E5F";
    case 16:
      return "#4A235A";
    case 17:
      return "#154360";
    case 18:
      return "#1B4F72";
    case 19:
      return "#0E6251";
    case 20:
      return "#186A3B";
    case 21:
      return "#7D6608";
    case 22:
      return "#784212";
    default:
      return "#ffffff";
  }
}

export default generateRhymes; 