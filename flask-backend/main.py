from flask import request, Flask, jsonify, render_template, jsonify
import lyricsgenius
from song import Song
import json
import re

app = Flask("__main__")


@app.route("/")
def my_index():
    return render_template("index.html", token="hello world")


@app.route("/lyrics/<artist>/<song_name>", methods=["GET"])
def get_lyrics(artist, song_name):
    request.is_xhr = True

    genius = lyricsgenius.Genius(
        "CRjhz6BZQCGb_mMvUiz2sTCpbgM9eKrZSSWWn24iq4QnZrc-DyNvvjWoB1YVBdX2")

    song = genius.search_song(song_name, artist)
    data = re.sub(r" ?\[[^\]]+\]", "", song.lyrics)
    return jsonify(isError=False,
                   message="Success",
                   statusCode=200,
                   data=data)


@app.route("/song", methods=['GET'])
def song():
    lyrics = request.args.get('lyrics')
    song = Song(lyrics)
    return json.dumps(song.find_all_rhyme_clusters())


app.run(debug=True)
