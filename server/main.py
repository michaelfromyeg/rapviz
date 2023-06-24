"""
Main entry point for the Flask server.
"""

import json
import re
import os

import lyricsgenius
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv

from .song import Song

app = Flask(__name__)
CORS(app)

config = {
    "DEBUG": True,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 3000,
}

app.config.from_mapping(config)
cache = Cache(app)

load_dotenv()

IS_DEVELOPMENT = os.getenv("PYTHON_ENV") == "development"

GENIUS_TOKEN = os.getenv("GENIUS_ACCESS_TOKEN")

genius = lyricsgenius.Genius(GENIUS_TOKEN)


@app.route("/lyrics/<artist>/<song_name>", methods=["GET"])
@cache.cached()
def get_lyrics(artist, song_name):
    """
    Return the lyrics for a particular song.
    """
    request.is_xhr = True

    genius_song = genius.search_song(song_name, artist)

    if genius_song is None:
        return jsonify(message="No lyrics found for this song"), 404

    lyrics = re.sub(r" ?\[[^\]]+\]", "", genius_song.lyrics)

    # Delete everything before the word 'lyrics'
    keyword = "Lyrics"
    lyrics = lyrics.split(keyword)[1]

    keyword2 = "You might also like"
    lyrics = lyrics.split(keyword2)[0]

    lyrics = lyrics.strip()

    return jsonify(lyrics=lyrics)


@app.route("/song", methods=["GET"])
@cache.cached()
def find_rhymes():
    """
    Determine the rhyme scheme for a given song.
    """
    lyrics = request.args.get("lyrics")
    song_instance = Song(lyrics)

    return json.dumps(song_instance.find_all_rhyme_clusters())


if __name__ == "__main__":
    if IS_DEVELOPMENT:
        genius.verbose = True

    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=os.getenv("PORT", "5000"),
        debug=IS_DEVELOPMENT,
    )
