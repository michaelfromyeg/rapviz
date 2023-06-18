"""
Main entry point for the Flask server.
"""

import json
import re
import os

import lyricsgenius
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from song import Song

app = Flask(__name__)
CORS(app)

load_dotenv()

IS_DEVELOPMENT = os.getenv("PYTHON_ENV") == "development"

GENIUS_TOKEN = os.getenv("GENIUS_ACCESS_TOKEN")

genius = lyricsgenius.Genius(GENIUS_TOKEN)


@app.route("/lyrics/<artist>/<song_name>", methods=["GET"])
def get_lyrics(artist, song_name):
    """
    Return the lyrics for a particular song.
    """
    request.is_xhr = True

    genuis_song = genius.search_song(song_name, artist)
    data = re.sub(r" ?\[[^\]]+\]", "", genuis_song.lyrics)

    return jsonify(isError=False, message="Success", statusCode=200, data=data)


@app.route("/song", methods=["GET"])
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
