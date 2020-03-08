import React from 'react';
import axios from 'axios';
import '../../App.css';
import generateRhymes from '../../util/generateWords';
import Word from './Word'

class PoetryVisualizer extends React.Component {
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
      <div className="Poetry-visualizer">
        <div className="Enter-bars">
        <input type="text" value={this.state.value} onChange={this.updateLyrics} placeholder="Enter your lyrics here!" />
        <br/>
        <a
          className="btn btn--loginApp-link Submit-lyrics"
          onClick={ this.handleSubmit }
          href={"javascript:void(0)"}
        >
          <i class="fas fa-robot"></i> ANALYZE YO' RHYMES
        </a>
        </div>
        <br></br>
        <br></br>
        <div className="Exit-bars">
          {output}
        </div>
      </div>
    );
  }
}

export default PoetryVisualizer;
