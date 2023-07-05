"""
Main entry point for the Flask server.
"""

import json
import re
import os
import logging

import lyricsgenius
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv

from song import Song

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

logging.basicConfig(level=logging.DEBUG if IS_DEVELOPMENT else logging.INFO)

genius = lyricsgenius.Genius(GENIUS_TOKEN)


@app.route("/lyrics/<artist>/<song_name>", methods=["GET"])
@cache.cached()
def get_lyrics(artist, song_name):
    """
    Return the lyrics for a particular song.
    """
    request.is_xhr = True

    could_not_find_song_response = jsonify(
        isError=True,
        message="Could not find song. Please try again.",
        statusCode=404,
    )

    # TODO(michaelfromyeg): migrate to less direct method; this causes 403s in production
    # genuis_song = genius.search_song(song_name, artist)

    genius_songs = genius.search_songs(f"{artist} {song_name}")
    logging.debug("genius_songs:%s", genius_songs)

    if genius_songs is None or "songs" not in genius_songs:
        return could_not_find_song_response

    genius_song_id = None

    for genuis_song in genius_songs:
        if genuis_song["title"] == song_name:
            genius_song_id = genuis_song["id"]

    logging.debug("genius_song_id:%s", genius_song_id)

    if genius_song_id is None:
        return could_not_find_song_response

    genuis_song_with_lyrics = genius.song(genius_song_id)

    if "lyrics" not in genuis_song_with_lyrics:
        return could_not_find_song_response

    lyrics = genuis_song_with_lyrics.lyrics

    lyrics = re.sub(r" ?\[[^\]]+\]", "", lyrics)

    if isinstance(lyrics, str):
        lyrics = lyrics.strip()

    # Delete everything before the word 'lyrics'
    keyword = "Lyrics"
    lyrics = lyrics.split(keyword)[1]

    keyword2 = "You might also like"
    lyrics = lyrics.split(keyword2)[0]

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
