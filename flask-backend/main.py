from flask import Flask, render_template, request, jsonify
import lyricsgenius

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

app.run(debug=True)