import React from "react";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";

import Word from "./Word";
import generateRhymes from "../../util/generateWords";
import { serverEndpoint } from "../../config";

class RhymeVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let { lyrics } = this.props;

    this.setState({
      loading: true,
    });
    axios
      .get(`${serverEndpoint}/song`, {
        params: {
          lyrics: lyrics,
        },
      })
      .then((res) => {
        // handle success
        this.setState({
          result: res.data,
          loading: false,
        });
      });
  }

  render() {
    let output = [];
    for (let array of generateRhymes(this.props.lyrics, this.state.result)) {
      let wordComponents = array.map((word) => {
        return <Word color={word.color} word={word.text} />;
      });
      output = output.concat(wordComponents);
      output.push(<br />);
    }
    return (
      <div className="visualizer">
        <a
          className="btn btn--loginApp-link Submit-lyrics"
          onClick={this.handleSubmit}
          href={"javascript:void(0)"}
        >
          <i class="fas fa-robot"></i> ANALYZE YO' RHYMES{" "}
          {this.state.loading && <CircularProgress />}
        </a>
        <section className="output">{output}</section>
      </div>
    );
  }
}

export default RhymeVisualizer;
