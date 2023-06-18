# rapviz 🔥

_Visualize your bars right in the browser!_

- [rapviz 🔥](#rapviz-)
  - [About](#about)
  - [Usage](#usage)
    - [Client](#client)
    - [Server](#server)
  - [See more](#see-more)

## About

This project was inspired by one of my favourite YouTube trends, the "rap visualizer" video. Take a look a Genius' [Check The Rhyme](https://youtube.com/watch?v=1VNHp_flJKE) or [Vox's Rap Deconstructed](https://youtube.com/watch?v=QWveXdj6oZU) as examples. We thought we could leverage NLP, a couple of free APIs, and some basic React to create a website that generates these kinds of 'highlighted' rhymes. Introducing: `rapviz`!

The app consists of a Flask REST server. This API interfaces with Genuis, and does a bit of work to produce a rhyme response the frontend understands. The frontend allows the user to connect to Spotify and detects what song they're currently listening to. It then visualizes the rhymes. Deployment is done via Railway.

## Usage

Head to `<URL>` to try it out!

To run the app locally, see the below instructions for the client and server code.

### Client

The client is written in React, and uses `create-react-app`. Its dependencies are as follows.

- `node`, `>=v18.16.0`
- `npm`, `>=v9.5.1`
- `yarn` (preferred over `npm`), `>=v1.22.19`
- (optional) `nvm`, `>=v0.39.2`

To get setup, run the following commands.

```plaintext
$ cd client
> (now at **/rapviz/client)

$ yarn
> yarn install v1.22.19
> ...

$ yarn start
> yarn run v1.22.19
> ...
>
```

### Server

The server is a simple Flask app. Its dependencies are as follows.

- `python@3.11`, `>=3.11.4`

To get setup, run the following commands.

```plaintext
$ cd server
> (now at **/rapviz/server)

$ python3 -m venv env
> (creates a virtual environment called `env`)

$ source env/bin/activate
> (activates said enviornment)

$ which pip
> $HOME/rapviz/server/env/bin/pip

$ pip install -r requirements.txt
> (install the dependencies)

$ python -m main.py
> (run the server)
```

## See more

- [The original DevPost submission](https://devpost.com/software/rapviz-breakdown-your-favourite-lyricist-s-rhyme-schemes)
- [Project write-up](https://michaeldemar.co/projects/rapviz)
- [Try it out](https://example.com)
