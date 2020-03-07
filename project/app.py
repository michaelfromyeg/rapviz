from flask import Flask, render_template, jsonify, make_response, json
import lyricsgenius
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hello')
def hello():
    return render_template('hello.html')

@app.route('/upload', methods=['GET'])
def upload():
    return json_response({'json': 'data'})

@app.route('/song', methods=['GET']) # Defaults to Drake's most popular song
def song():
    GENIUS_API_TOKEN = os.getenv('GENIUS_API_TOKEN')
    genius = lyricsgenius.Genius(GENIUS_API_TOKEN)
    artist = genius.search_artist("Drake", max_songs=1, sort="popularity")
    lyrics = artist.songs[0].lyrics
    print(lyrics)
    print(type(lyrics))
    return json_response(
        {'lyrics': lyrics}
    )

def json_response(payload, status=200):
     return (json.dumps(payload), status, {'content-type': 'application/json'})

if __name__ == '__main__':
    app.run(debug=True)
