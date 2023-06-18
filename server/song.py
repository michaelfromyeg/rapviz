"""
Song class that consumes lyrics and determines the rhyme scheme.
"""

import re
from typing import Dict, List

from datamuse import datamuse


class Song:
    """
    Song class.
    """

    def __init__(self, lyrics: str):
        """initialize song object

        Arguments:
            string {str} -- string to analyze
        """
        self.api = datamuse.Datamuse()
        self.lyrics = lyrics
        replace_all_punc = re.sub("[.,:?!;\-()']", "", self.lyrics)
        self.lyrics_array = re.split("[ |\n]", replace_all_punc)
        self.rhymes = self.generate_rhymes(self.lyrics_array)

        self.blacklist = ["a", "the", "can", "an"]
        # print(self.lyrics_array)

    def generate_rhymes(self, string_arr: List[str]) -> Dict[str, List[str]]:
        """Generates all possible rhymes for every word in the lyrics

        Arguments:
            str_arr {List[str]} -- list of words in the song's lyrics

        Returns:
            Dict[str, List[str]] -- dict with each word associated with a list of rhyming words
        """
        res = dict()

        for string in string_arr:
            string = string.lower()

            if string not in res:
                rhymes = self.api.words(rel_rhy=string)
                res[string] = list(map(lambda rhyme: rhyme["word"], rhymes))

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

        if word1 not in rhymes or word2 not in rhymes:
            return False

        return word1 in rhymes[word2] or word2 in rhymes[word1]

    def remove_all_single_words(self, clusters):
        """
        Removes all lists in which there is only a single word.
        """
        removed_clusters = []
        for cluster in clusters:
            if len(cluster) > 1:
                removed_clusters.append(cluster)

        return removed_clusters

    def find_all_rhyme_clusters(self):
        """
        [Words] -> [[Clusters of words that rhyme with one another]]
        """
        all_rhyme_clusters = []
        for word in self.lyrics_array:
            all_rhyme_clusters = self.check_cluster(word, all_rhyme_clusters)

        return self.remove_all_single_words(all_rhyme_clusters)

    def check_cluster(self, word, clusters):
        """
        word, [[Clusters of words that rhyme]]
        """
        if len(clusters) < 1:
            clusters.append([word])
            return clusters

        for cluster in clusters:
            if self.rhyme(cluster[0], word):
                cluster.append(word)
                return clusters
        clusters.append([word])

        return clusters
