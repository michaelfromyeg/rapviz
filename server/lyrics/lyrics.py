from flyrics import Flyrics

lyric = Flyrics()
lyricJson = lyric.fetch("https://open.spotify.com/track/5jbDih9bLGmI8ycUKkN5XA")
print(lyricJson)
