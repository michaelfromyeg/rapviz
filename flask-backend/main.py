from flask import request, Flask, jsonify, render_template
from song import Song
import json

app = Flask("__main__")

@app.route("/")
def my_index():
    return render_template("index.html", token="hello world")

@app.route("/song", methods=['GET'])
def song():
    lyrics = request.args.get('lyrics')
    song = Song(lyrics)
    return json.dumps(song.find_all_rhyme_clusters())

app.run(debug=True)