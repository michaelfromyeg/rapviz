import React, { useState, useEffect, useCallback } from "react";

// TODO(michaelfromyeg): normalize CSS using a better CSS library, instead
import Normalize from 'react-normalize';

import {
  serverEndpoint,
} from "./config";
import hash from "./util/hash";
import Player from "./components/Player";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import PoetryVisualizer from "./components/PoetryVisualizer";
import RhymeVisualizer from "./components/RhymeVisualizer";
import Footer from "./components/Footer";

import "./styles/global.css";


const App = () => {
  const [token, setToken] = useState(null);
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
      console.log(`Setting token to ${_token}...`)

      setToken(_token);
    }
  }, []);

  // Initial check of currently playing song
  useEffect(() => {
    pingSpotify();
  }, [pingSpotify]);

  // Update song information every 3 seconds
  setInterval(() => {
    pingSpotify();
  }, 30000);

  /**
   * Get the user's currently playing song via the Spotify WebSDK.
   */
  const getCurrentlyPlayingSong = useCallback(async () => {
    if (!token) {
      console.warn("No token found");
      return;
    }

    console.log("Fetching currently playing song...");

    try {
      // Make a call using the token
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (response.status === 404) {
        throw new Error("Could not find lyrics!")
      }

      if (response.statsu === 204) {
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
  }, [token]);

  useEffect(() => {
    getCurrentlyPlayingSong(token);
  }, [token, getCurrentlyPlayingSong]);

  // When the currently playing song changes, fetch the lyrics
  useEffect(() => {
    const getLyrics = async () => {
      // Guard for no song playing or missing data to find lyrics
      if (!item || !item.artists || !item.artists[0] || !item.name) {
        console.warn("No song playing or missing data to find lyrics");
        return;
      };

      try {
        const response = await fetch(`${serverEndpoint}/lyrics/${item.artists[0].name}/${item.name}`)

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
    }

    getLyrics();
  }, [item]);


  const onPoetry = () => {
    setToken("poetry");
  }

  const onBack = () => {
    setToken(null);
  }

  return (
    <div className="app">
      <Normalize />
      <Header />
      {!token && (
        <Welcome onPoetry={onPoetry} />
      )}
      {token && token === "poetry" && (
        <>
          {/* TODO(michaelfromyeg): rename; add song search (without Spotify) */}
          <PoetryVisualizer onBack={onBack} />
        </>
      )}
      {token && token !== "poetry" && (
        <RhymeVisualizer item={item} isPlaying={isPlaying} progressMs={progressMs} onBack={onBack} lyrics={lyrics} />
      )}
      <Footer />
    </div>
  );
}

export default App;
