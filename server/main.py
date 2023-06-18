"""
Main entry point for the Flask server.
"""

import json
import re

import lyricsgenius
from flask import Flask, jsonify, request
from dotenv import load_dotenv

from song import Song

app = Flask("__main__")

load_dotenv()


@app.route("/lyrics/<artist>/<song_name>", methods=["GET"])
def get_lyrics(artist, song_name):
    """
    Return the lyrics for a particular song.
    """
    request.is_xhr = True

    genius = lyricsgenius.Genius()

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


app.run(debug=True)
