from datamuse import datamuse
from typing import *

class Song:
  def __init__(self, lyrics: str):
    """initialize song object
    
    Arguments:
        string {str} -- string to analyze
    """
    self.api = datamuse.Datamuse()
    self.lyrics = lyrics
    self.rhymes = self.generate_rhymes(lyrics.split(" "))

  def generate_rhymes(self, str_arr : List[str]) -> Dict[str, List[str]]:
    """Generates all possible rhymes for every word in the lyrics
    
    Arguments:
        str_arr {List[str]} -- list of words in the song's lyrics
    
    Returns:
        Dict[str, List[str]] -- dict with each word associated with a list of rhyming words
    """
    res = dict()
    for s in str_arr:
      s = s.lower()
      if s not in res.keys():
        rhymes = self.api.words(rel_rhy=s)
        res[s] = list(map(lambda rhyme: rhyme["word"], rhymes))
    return res

  def rhyme(self, word1: str, word2: str) -> bool:
    """return true if the two words rhyme and are in the lyrics
    
    Arguments:
        word1 {str} -- first word
        word2 {str} -- second word
    
    Returns:
        bool -- does the two words rhyme
    """
    rhymes = self.rhymes
    if word1 not in rhymes.keys() or word2 not in rhymes.keys():
      return False
    return word1 in rhymes[word2] or word2 in rhymes[word1]
    

s = Song("Roses are red violets are blue jack is you hack is true")
print(s.rhyme("roses", "are"))
print(s.rhyme("jack", "hack"))
print(s.rhyme("pack", "hack"))