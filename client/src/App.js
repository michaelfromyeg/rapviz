import React, { Component } from "react";
import * as $ from "jquery";
import axios from "axios";

import { serverEndpoint, authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";

import PoetryVisualizer from "./components/RhymeVisualizer/PoetryVisualizer";
import RhymeVisualizer from "./components/RhymeVisualizer/RhymeVisualizer";

import header from "./assets/text-logo.png";
import logo from "./assets/logo.svg";

import "./styles/global.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }],
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0,
      },
      is_playing: "Paused",
      progress_ms: 0,
      lyrics: "",
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.onPoetry = this.onPoetry.bind(this);
    this.pingSpotify();
    this.interval = setInterval(this.pingSpotify.bind(this), 3000);
  }

  pingSpotify() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });
      this.getCurrentlyPlaying(_token);
    }
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        console.log({ data });

        if (data && data.item !== null && data.item.name !== this.state.item.name) {
          // check if song is different than current song
          axios
            .get(`${serverEndpoint}/lyrics/${data.item.artists[0].name}/${data.item.name}`)
            .then((res) => {
              // handle success
              console.log(res.data);
              this.setState({
                lyrics: res.data.data,
              });
            });

          this.setState({
            item: data.item,
            is_playing: data.is_playing,
            progress_ms: data.progress_ms,
          });
        }
      },
    });
  }

  onPoetry() {
    console.log("onPoetry");
    console.log(this.state.token);
    this.setState({
      token: "poetry",
    });
    console.log(this.state.token);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img src={header} width="25%" className="Header-text" alt="header" />
          {!this.state.token && (
            <>
              <h1>Welcome to RapViz!</h1>
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=token&show_dialog=true`}
              >
                <i class="fab fa-spotify"></i> SPOTIFY
              </a>
              <br></br>
              <a
                className="btn btn--loginApp-link"
                onClick={this.onPoetry}
                href={"javascript:void(0)"}
              >
                <i class="fas fa-pencil-alt"></i> FREESTYLE
              </a>
            </>
          )}
          {this.state.token && this.state.token === "poetry" && (
            <>
              <p>Enter your bars below!</p>
              <PoetryVisualizer />
            </>
          )}
          {this.state.token && this.state.token !== "poetry" && (
            <div className="flex-colmn">
              <Player
                item={this.state.item}
                is_playing={this.state.is_playing}
                progress_ms={this.progress_ms}
              />
              <RhymeVisualizer lyrics={this.state.lyrics} />
            </div>
          )}
          <div className="Footer-div">
            <p className="Footer-text">
              Bringing the <em>fire</em> to firebase
            </p>
            <p className="Footer-text">
              &copy; 2020 RapViz. Built for HackTech 2020
            </p>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
