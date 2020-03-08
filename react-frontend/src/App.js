import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import {TextField, Button, Container, Typography} from '@material-ui/core';
import generateRhymes from './util/generateWords';
import Word from './components/RhymeVisualizer/Word'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: "",
      result: []
    };
    this.updateLyrics = this.updateLyrics.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateLyrics(e) {
    this.setState({
      lyrics: e.target.value
    })
  }

  handleSubmit() {
    let { lyrics } = this.state;

    axios.get('/song', {
      params: {
        lyrics: lyrics
      }
    })
      .then(res => {
        // handle success
        this.setState({
          result: res.data
        });
      })
  }

  render() {
    let output = [];
    for (let array of generateRhymes(this.state.lyrics, this.state.result)) {
      let wordComponents = array.map(word => {
        return <Word color={word.color} word={word.text} />
      });
      output = output.concat(wordComponents);
      output.push(<br />);
    }
    return (
      <div className="App">
        <Container>
        <Typography variant="h1" component="h2">
          RapViz
        </Typography>
          <section className="input">
            <TextField
              id="outlined-multiline-static"
              label="Song Lyrics"
              multiline
              rows="4"
              defaultValue="Enter your song lyrics here!"
              variant="outlined"
              onChange={this.updateLyrics}
            />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}>
              Analyze Rhymes!
            </Button>
          </section>
          <section className="output">
            {output}
          </section>
        </Container>
      </div>
    );
  }
}

export default App;
