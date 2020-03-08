import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import {Button} from '@material-ui/core';
import generateRhymes from './util/generateWords';
import Word from './components/RhymeVisualizer/Word'

class RhymeVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: props.lyrics,
      result: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
      <section className="output">
        {output}
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}>
          Analyze Rhymes!
        </Button>
      </section>
    );
  }
}

export default App;
