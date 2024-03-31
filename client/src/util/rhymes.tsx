import { ReactElement } from "react";
import Word from "../components/Word";
import generateRhymes from "./generateWords";

/**
 * Get the JSX output for the rhymes in the given text.
 *
 * TODO(michaelfromyeg): this sucks.
 *
 * @returns {JSX.Element[]}
 */
export const buildRhymeOutput = (lyrics: any, rhymes: any) => {
  console.log("Combining rhymes with lyrics for output...");
  console.log({
    lyrics,
    rhymes,
  });

  const lyricsWithRhymes = generateRhymes(lyrics, rhymes);

  let retval: ReactElement[] = [];
  for (const array of lyricsWithRhymes) {
    const words = array.map((word: any) => {
      return <Word color={word.color} word={word.text} />;
    });

    retval = retval.concat(words);
    retval.push(<br />);
  }

  return retval;
};
