import { CSSProperties, useEffect, useRef, useState } from "react";

import { convertHtmlToRtf } from "../util/rtf";

import { Lrc, useRecoverAutoScrollImmediately } from "react-lrc";
import useTimer from "../hooks/useTimer";
import { formatMillisecond } from "../util/helpers";

const lrcStyle: CSSProperties = {
  height: "100%",
  padding: "5px 0",
};

const UploadVisualizer = ({
  onBack,
  lyrics,
  item,
  isPlaying,
  progressMs,
}: any) => {
  const [rhymes, setRhymes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // new for LRC; TODO(michaelfromyeg): update component to make these make sense
  const { currentMillisecond, setCurrentMillisecond, reset, play, pause } =
    useTimer(2);
  const { signal, recoverAutoScrollImmediately } =
    useRecoverAutoScrollImmediately();
  const [lrc, setLrc] = useState<string>("");

  const handleSubmit = () => {
    console.log("Submit!");
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

  useEffect(() => {
    const getLrc = async () => {
      try {
        const response = await fetch("/texas-hold-em.lrc");
        const text = await response.text();
        setLrc(text);
      } catch (error) {
        console.error(error);
      }
    };

    getLrc();
  }, []);

  return (
    <div className="visualizer">
      <h3>Upload some music!</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
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
      </div>
      {isLoading && <p className="loading">(one sec...)</p>}
      <div className={"lrc-root"}>
        <Control
          onPlay={play}
          onPause={pause}
          onReset={reset}
          current={currentMillisecond}
          setCurrent={setCurrentMillisecond}
          recoverAutoScrollImmediately={recoverAutoScrollImmediately}
        />
        <div className="lrc-box">
          <Lrc
            lrc={lrc}
            lineRenderer={({ active, line }) => (
              <div
                className={"lyric"}
                style={{
                  color: active ? "yellow" : "white",
                }}
              >
                <span className="time">
                  {formatMillisecond(line.startMillisecond)}
                </span>
                &nbsp;
                {line.content}
              </div>
            )}
            currentMillisecond={currentMillisecond}
            style={lrcStyle}
            verticalSpace={true}
            recoverAutoScrollSingal={signal}
            recoverAutoScrollInterval={5000}
          />
        </div>
      </div>
    </div>
  );
};

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent,
  recoverAutoScrollImmediately,
}: {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  current: number;
  setCurrent: (c: number) => void;
  recoverAutoScrollImmediately: () => void;
}) {
  return (
    <div>
      <button type="button" onClick={onPlay}>
        play
      </button>
      <button type="button" onClick={onPause}>
        pause
      </button>
      <button type="button" onClick={onReset}>
        reset
      </button>
      <input
        type="number"
        value={current}
        onChange={(event) => setCurrent(Number(event.target.value))}
      />
      <button type="button" onClick={recoverAutoScrollImmediately}>
        recover auto scroll immediately
      </button>
    </div>
  );
}

export default UploadVisualizer;
