# RapViz
## Visualize your bars right in the browser

### About

There are loads of videos online that inspired this project. Take a look a Genius' [Check The Rhyme](https://www.youtube.com/watch?v=1VNHp_flJKE) or [Vox's Rap Deconstructed](https://www.youtube.com/watch?v=QWveXdj6oZU). These videos get millions, and I mean millions of hits online. Why? Well, it's damn fun! And it's cool. We thought we could leverage NLP, a couple of freely available APIs, and some basic React so create a website that generates these kinds of 'highlighted' rhymes. So what happened?

### Run the app on your machine

To run the app, first `cd react-frontend` and `run npm i` to install the necessary Node dependencies. Then, run `pip install flask` to make sure you have Flask installed. Finally, navigate to the project root and run the bash file by calling `sh run.sh`.

### How it's made

We used a Flask backend to write a couple of endpoints to help us LyricsGenius, an API for scraping lyrics from Genius. We also wrote our NLP-based rhyme detection algorithm in Python and processed all of that data on the backend. Spotify authentication and the UI was all handled by React. We eventually deployed our app to Google Cloud so other users could try it.

### Elsewhere on the internet

You can see our DevPost submission [here](https://devpost.com/software/rapviz-breakdown-your-favourite-lyricist-s-rhyme-schemes), or try the project [here](https://rapviz.appspot.com/).
