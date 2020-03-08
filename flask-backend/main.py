from flask import request, Flask, jsonify, render_template, jsonify
import lyricsgenius
from song import Song
import json

app = Flask("__main__")

@app.route("/")
def my_index():
    return render_template("index.html", token="hello world")

@app.route("/lyrics", methods=["GET"])
def get_lyrics():
    song_name = request.args.get()
    
    
    return jsonify(isError= False,
                message= "Success",
                statusCode= 200,
                data= data)

@app.route("/song", methods=['GET'])
def song():
    lyrics = request.args.get('lyrics')
    song = Song(lyrics)
    return json.dumps(song.find_all_rhyme_clusters())

app.run(debug=True)