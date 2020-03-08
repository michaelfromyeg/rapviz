from datamuse import datamuse
from typing import *
import re

class Song:
  def __init__(self, lyrics: str):
    """initialize song object
    
    Arguments:
        string {str} -- string to analyze
    """
    self.api = datamuse.Datamuse()
    self.lyrics = lyrics
    replace_all_punc = re.sub("[.,:?!;\-()']","", self.lyrics)
    self.lyrics_array = re.split("[ |\n]", replace_all_punc)
    self.rhymes = self.generate_rhymes(self.lyrics_array)

    self.blacklist = ['a', 'the', 'can', 'an']
    # print(self.lyrics_array)

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
    if word1 in self.blacklist or word2 in self.blacklist:
        return False
    word1 = word1.lower()
    word2 = word2.lower()
    if word1 not in rhymes.keys() or word2 not in rhymes.keys():
      return False
    return word1 in rhymes[word2] or word2 in rhymes[word1]

  # removes all lists in which there is only a single
  def removeAllSingleWords(self, clusters):
      removedClusters = []
      for cluster in clusters:
          if len(cluster) > 1:
              removedClusters.append(cluster)
      return removedClusters



  # [Words] -> [[Clusters of words that rhyme with one another]]
  def find_all_rhyme_clusters(self):
      allRhymeClusters = []
      for word in self.lyrics_array:
          allRhymeClusters = self.checkCluster(word, allRhymeClusters)
      return self.removeAllSingleWords(allRhymeClusters)

  # word, [[Clusters of words that rhyme]]
  def checkCluster(self, word, clusters):
      if len(clusters) < 1:
          clusters.append([word])
          return clusters
      
      for cluster in clusters:
          if self.rhyme(cluster[0], word):
              cluster.append(word)
              return clusters
      clusters.append([word])
      return clusters