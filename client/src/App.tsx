import { ReactElement, useCallback, useEffect, useState } from "react";

import { serverEndpoint } from "./config";
import hash from "./util/hash";

import Footer from "./components/Footer";
import Header from "./components/Header";
import PoetryVisualizer from "./components/PoetryVisualizer";
import RhymeVisualizer from "./components/RhymeVisualizer";
import Welcome from "./components/Welcome";

import UploadVisualizer from "./components/UploadVisualizer";
import "./styles/global.css";

const App = (): ReactElement => {
  const [token, setToken] = useState<string | null>(null);
  const [item, setItem] = useState({
    album: {
      images: [{ url: "" }],
    },
    name: "",
    artists: [{ name: "" }],
    duration_ms: 0,
  });
  const [isPlaying, setIsPlaying] = useState("Paused");
  const [progressMs, setProgressMs] = useState(0);
  const [lyrics, setLyrics] = useState("");

  const pingSpotify = useCallback(() => {
    console.log("Pinging Spotify...");

    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      console.log(`Setting token to ${_token}...`);

      setToken(_token);
    }
  }, []);

  useEffect(() => {
    pingSpotify();
  }, [pingSpotify]);

  setInterval(() => {
    pingSpotify();
  }, 30_000);

  /**
   * Get the user's currently playing song via the Spotify WebSDK.
   */
  const getCurrentlyPlayingSong = useCallback(async (token: string) => {
    if (!token) {
      console.warn("No token found");
      return;
    }

    if (token === "poetry" || token === "upload") {
      console.warn(`Called getCurrentlyPlayingSong in ${token} mode`);
      return;
    }

    console.log("Fetching currently playing song from Spotify...");
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (response.status === 404) {
        throw new Error("Could not find lyrics!");
      }

      if (response.status === 204) {
        console.warn("No song currently playing");
        return;
      }

      const data = await response.json();
      console.log({ data });

      setItem(data?.item);
      setIsPlaying(data?.is_playing);
      setProgressMs(data?.progress_ms);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (token && token !== "poetry" && token !== "upload") {
      getCurrentlyPlayingSong(token);
    }
  }, [token, getCurrentlyPlayingSong]);

  useEffect(() => {
    const getLyrics = async () => {
      // Guard for no song playing or missing data to find lyrics
      if (!item || !item.artists || !item.artists[0] || !item.name) {
        console.warn(
          "No song playing or missing necessary data to find lyrics"
        );
        return;
      }

      try {
        const response = await fetch(
          `${serverEndpoint}/lyrics/${item.artists[0].name}/${item.name}`
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log({ data });

        // TODO(michaelfromyeg): rename 'data' field of lyrics to something more descriptive
        setLyrics(data?.lyrics);
      } catch (error) {
        console.error(error);
      }
    };

    getLyrics();
  }, [item]);

  const onPoetry = (): void => {
    setToken("poetry");
  };

  const onUpload = (): void => {
    setToken("upload");
  };

  const onBack = () => {
    setToken(null);
  };

  return (
    <div className="app">
      <Header />
      {!token && <Welcome onPoetry={onPoetry} onUpload={onUpload} />}
      {/* TODO(michaelfromyeg): rename; add song search (without Spotify) */}
      {token && token === "poetry" && <PoetryVisualizer onBack={onBack} />}
      {token && token === "upload" && <UploadVisualizer onBack={onBack} />}
      {token && token !== "poetry" && (
        <RhymeVisualizer
          item={item}
          isPlaying={isPlaying}
          progressMs={progressMs}
          onBack={onBack}
          lyrics={lyrics}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;
