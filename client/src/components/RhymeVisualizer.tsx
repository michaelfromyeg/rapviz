import { useMemo, useRef, useState } from "react";

import { serverEndpoint } from "../config";
import { buildRhymeOutput } from "../util/rhymes";
import { convertHtmlToRtf } from "../util/rtf";
import Player from "./Player";

const RhymeVisualizer = ({
  onBack,
  lyrics,
  item,
  isPlaying,
  progressMs,
}: any) => {
  const [rhymes, setRhymes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${serverEndpoint}/song?lyrics=${encodedLyrics}`
      );

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

  const handleRichCopy = async () => {
    if (!contentRef.current) {
      return;
    }

    const htmlContent = contentRef.current.innerHTML;

    // Use the Clipboard API if available; else, download an RTF file
    if (navigator.clipboard && navigator.clipboard.write) {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const item = new ClipboardItem({ "text/html": blob });

      try {
        await navigator.clipboard.write([item]);
        console.log("Rich text copied to clipboard.");
      } catch (error) {
        console.error("Failed to copy rich text: ", error);
      }
    } else {
      const rtfContent = convertHtmlToRtf(htmlContent);

      const blob = new Blob([rtfContent], { type: "application/rtf" });

      const filename = "lyrics.rtf";

      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = filename;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(anchor.href);
    }
  };

  const encodedLyrics = useMemo(() => encodeURIComponent(lyrics), [lyrics]);
  const rhymeOutput = useMemo(
    () => buildRhymeOutput(lyrics, rhymes),
    [lyrics, rhymes]
  );

  if (!lyrics) {
    return null;
  }

  return (
    <div className="visualizer">
      <h3>Go listen to something!</h3>
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
      <button
        className="btn btn--loginApp-link Submit-lyrics"
        onClick={handleRichCopy}
      >
        COPY
      </button>
      {isLoading && <p className="loading">(one sec...)</p>}
      <div className="rap-wrapper">
        <Player item={item} isPlaying={isPlaying} progressMs={progressMs} />
        <div ref={contentRef} className="output">
          {rhymeOutput}
        </div>
      </div>
    </div>
  );
};

export default RhymeVisualizer;
