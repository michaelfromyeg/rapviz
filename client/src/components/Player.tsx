import { ReactElement } from "react";
import "../styles/Player.css";

interface Album {
  images: any;
}

interface Item {
  album: Album;
  artists: any;
  name: string;
  duration_ms: number;
}

interface PlayerProps {
  item: Item;
  isPlaying: boolean;
  progressMs: number;
}

const Player = (props: PlayerProps): ReactElement | null => {
  if (
    !props.item ||
    !props.item.album ||
    !props.item.album.images ||
    !props.item.album.images[0]
  ) {
    console.warn("Missing item");
    return null;
  }

  if (!props.progressMs || !props.item.duration_ms) {
    console.warn("Missing progress");
    return null;
  }

  const progressBarStyles = {
    width: (props.progressMs * 100) / props.item.duration_ms + "%",
  };

  return (
    <div className="main-wrapper">
      <div className="now-playing__img">
        <img alt="Album cover" src={props.item.album.images[0].url} />
      </div>
      <div className="now-playing__side">
        <div className="now-playing__name">{props.item.name}</div>
        <div className="now-playing__artist">{props.item.artists[0].name}</div>
        <div className="now-playing__status">
          {props.isPlaying ? "Playing" : "Paused"}
        </div>
        <div className="progress">
          <div className="progress__bar" style={progressBarStyles} />
        </div>
      </div>
    </div>
  );
};

export default Player;
