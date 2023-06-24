import { useState, useMemo } from "react";

import Player from "./Player";
import { buildRhymeOutput } from "../util/rhymes";
import { serverEndpoint } from "../config";

const RhymeVisualizer = ({ onBack, lyrics, item, isPlaying, progressMs }) => {
  const [rhymes, setRhymes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${serverEndpoint}/song?lyrics=${encodedLyrics}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log({ data });

      setRhymes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const encodedLyrics = useMemo(() => encodeURIComponent(lyrics), [lyrics]);
  const rhymeOutput = useMemo(() => buildRhymeOutput(lyrics, rhymes), [lyrics, rhymes]);

  if (!lyrics) {
    return null;
  }

  return (
    <div className="visualizer">
      <h3>Go listen to something!</h3>
      <button
        className="btn btn--loginApp-link"
        onClick={onBack}
      >
        BACK
      </button>
      <button
        className="btn btn--loginApp-link Submit-lyrics"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        ANALYZE
      </button>
      {isLoading && <p className="loading">(one sec...)</p>}
      <div className="rap-wrapper">
        <Player
          item={item}
          isPlaying={isPlaying}
          progressMs={progressMs}
        />
        <section className="output">{rhymeOutput}</section>
      </div>


    </div>
  );
}

export default RhymeVisualizer;
