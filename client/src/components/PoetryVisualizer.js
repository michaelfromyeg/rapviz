import { useState, useMemo } from "react";

import { serverEndpoint } from "../config";
import { buildRhymeOutput } from "../util/rhymes";

const PoetryVisualizer = ({ onBack }) => {
  const [lyrics, setLyrics] = useState("");
  const [rhymes, setRhymes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLyrics = (e) => {
    setLyrics(e.target.value);
  };

  /**
   * When the user submits the form, send the lyrics to the server and get the
   * rhymes back.
   */
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // TODO(michaelfromyeg): move the lyrics out of the URL?! WTF!
      const response = await fetch(
        `${serverEndpoint}/song?lyrics=${encodeURIComponent(lyrics)}`
      );

      console.log(response);

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
  };

  const rhymeOutput = useMemo(
    () => buildRhymeOutput(lyrics, rhymes),
    [lyrics, rhymes]
  );

  return (
    <div className="freestyle">
      <h3>Write some lyrics!</h3>
      <button className="btn btn--loginApp-link" onClick={onBack}>
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
      <textarea
        type="text"
        value={lyrics}
        onChange={handleLyrics}
        placeholder="Enter your lyrics here!"
      />
      <div className="output">{rhymeOutput}</div>
    </div>
  );
};

export default PoetryVisualizer;
