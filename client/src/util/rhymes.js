import Word from "../components/Word";
import generateRhymes from "../util/generateWords";

/**
 * Get the JSX output for the rhymes in the given text.
 *
 * TODO(michaelfromyeg): this sucks.
 *
 * @returns {JSX.Element[]}
 */
export const buildRhymeOutput = (lyrics, rhymes) => {
  console.log("Combining rhymes with lyrics for output...");
  console.log({
    lyrics,
    rhymes,
  });

  const lyricsWithRhymes = generateRhymes(lyrics, rhymes);

  let retval = [];
  for (const array of lyricsWithRhymes) {
    const words = array.map((word) => {
      return <Word color={word.color} word={word.text} />;
    });

    retval = retval.concat(words);
    retval.push(<br />);
  }

  return retval;
};
