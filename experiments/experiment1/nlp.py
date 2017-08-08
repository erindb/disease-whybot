#! /usr/bin/env python

"""

<<<<<<< HEAD
Server will use this script to transform a corenlp parse of a
user response to components:

actual_explanans
actual_explanandum

skeleton_explanans
negated_skeleton_explanans

skeleton_explanandum
negated_skeleton_explanandum

"skeleton" means for each PERSON, replace them with a slot where a
random name can go.

resolve other pronouns (they, it, etc.) as best as we can...

"""

sentence = "Bob helped Amy because her friends weren't there to help her."
desired = "[PERSON 1]'s friends weren't there to help [PRONOUN 1 object] because ..."

parse = {
  "sentences": [
    {
      "index": "0",
      "parse": "(ROOT\n  (S\n    (NP (PRP I))\n    (VP (VBD helped)\n      (NP\n        (NP (NNP Amy))\n        (SBAR (IN because)\n          (S\n            (NP (PRP$ her) (NNS friends))\n            (VP (VBD were) (RB n't)\n              (ADVP (RB there))))))\n      (S\n        (VP (TO to)\n          (VP (VB help)\n            (NP (PRP her))))))\n    (. .)))",
      "basic-dependencies": [
        {
          "dep": "ROOT",
          "governor": "0",
          "governorGloss": "ROOT",
          "dependent": "2",
          "dependentGloss": "helped"
        },
        {
          "dep": "nsubj",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "1",
          "dependentGloss": "I"
        },
        {
          "dep": "dobj",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "3",
          "dependentGloss": "Amy"
        },
        {
          "dep": "mark",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "4",
          "dependentGloss": "because"
        },
        {
          "dep": "nmod:poss",
          "governor": "6",
          "governorGloss": "friends",
          "dependent": "5",
          "dependentGloss": "her"
        },
        {
          "dep": "nsubj",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "6",
          "dependentGloss": "friends"
        },
        {
          "dep": "dep",
          "governor": "3",
          "governorGloss": "Amy",
          "dependent": "7",
          "dependentGloss": "were"
        },
        {
          "dep": "neg",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "8",
          "dependentGloss": "n't"
        },
        {
          "dep": "advmod",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "9",
          "dependentGloss": "there"
        },
        {
          "dep": "mark",
          "governor": "11",
          "governorGloss": "help",
          "dependent": "10",
          "dependentGloss": "to"
        },
        {
          "dep": "advcl",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "11",
          "dependentGloss": "help"
        },
        {
          "dep": "dobj",
          "governor": "11",
          "governorGloss": "help",
          "dependent": "12",
          "dependentGloss": "her"
        }
      ],
      "collapsed-dependencies": [
        {
          "dep": "ROOT",
          "governor": "0",
          "governorGloss": "ROOT",
          "dependent": "2",
          "dependentGloss": "helped"
        },
        {
          "dep": "nsubj",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "1",
          "dependentGloss": "I"
        },
        {
          "dep": "dobj",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "3",
          "dependentGloss": "Amy"
        },
        {
          "dep": "mark",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "4",
          "dependentGloss": "because"
        },
        {
          "dep": "nmod:poss",
          "governor": "6",
          "governorGloss": "friends",
          "dependent": "5",
          "dependentGloss": "her"
        },
        {
          "dep": "nsubj",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "6",
          "dependentGloss": "friends"
        },
        {
          "dep": "dep",
          "governor": "3",
          "governorGloss": "Amy",
          "dependent": "7",
          "dependentGloss": "were"
        },
        {
          "dep": "neg",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "8",
          "dependentGloss": "n't"
        },
        {
          "dep": "advmod",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "9",
          "dependentGloss": "there"
        },
        {
          "dep": "mark",
          "governor": "11",
          "governorGloss": "help",
          "dependent": "10",
          "dependentGloss": "to"
        },
        {
          "dep": "advcl",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "11",
          "dependentGloss": "help"
        },
        {
          "dep": "dobj",
          "governor": "11",
          "governorGloss": "help",
          "dependent": "12",
          "dependentGloss": "her"
        }
      ],
      "collapsed-ccprocessed-dependencies": [
        {
          "dep": "ROOT",
          "governor": "0",
          "governorGloss": "ROOT",
          "dependent": "2",
          "dependentGloss": "helped"
        },
        {
          "dep": "nsubj",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "1",
          "dependentGloss": "I"
        },
        {
          "dep": "dobj",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "3",
          "dependentGloss": "Amy"
        },
        {
          "dep": "mark",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "4",
          "dependentGloss": "because"
        },
        {
          "dep": "nmod:poss",
          "governor": "6",
          "governorGloss": "friends",
          "dependent": "5",
          "dependentGloss": "her"
        },
        {
          "dep": "nsubj",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "6",
          "dependentGloss": "friends"
        },
        {
          "dep": "dep",
          "governor": "3",
          "governorGloss": "Amy",
          "dependent": "7",
          "dependentGloss": "were"
        },
        {
          "dep": "neg",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "8",
          "dependentGloss": "n't"
        },
        {
          "dep": "advmod",
          "governor": "7",
          "governorGloss": "were",
          "dependent": "9",
          "dependentGloss": "there"
        },
        {
          "dep": "mark",
          "governor": "11",
          "governorGloss": "help",
          "dependent": "10",
          "dependentGloss": "to"
        },
        {
          "dep": "advcl",
          "governor": "2",
          "governorGloss": "helped",
          "dependent": "11",
          "dependentGloss": "help"
        },
        {
          "dep": "dobj",
          "governor": "11",
          "governorGloss": "help",
          "dependent": "12",
          "dependentGloss": "her"
        }
      ],
      "tokens": [
        {
          "index": "1",
          "word": "I",
          "lemma": "I",
          "characterOffsetBegin": "0",
          "characterOffsetEnd": "1",
          "pos": "PRP",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "2",
          "word": "helped",
          "lemma": "help",
          "characterOffsetBegin": "2",
          "characterOffsetEnd": "8",
          "pos": "VBD",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "3",
          "word": "Amy",
          "lemma": "Amy",
          "characterOffsetBegin": "9",
          "characterOffsetEnd": "12",
          "pos": "NNP",
          "ner": "PERSON",
          "speaker": "PER0"
        },
        {
          "index": "4",
          "word": "because",
          "lemma": "because",
          "characterOffsetBegin": "13",
          "characterOffsetEnd": "20",
          "pos": "IN",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "5",
          "word": "her",
          "lemma": "she",
          "characterOffsetBegin": "21",
          "characterOffsetEnd": "24",
          "pos": "PRP$",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "6",
          "word": "friends",
          "lemma": "friend",
          "characterOffsetBegin": "25",
          "characterOffsetEnd": "32",
          "pos": "NNS",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "7",
          "word": "were",
          "lemma": "be",
          "characterOffsetBegin": "33",
          "characterOffsetEnd": "37",
          "pos": "VBD",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "8",
          "word": "n't",
          "lemma": "not",
          "characterOffsetBegin": "37",
          "characterOffsetEnd": "40",
          "pos": "RB",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "9",
          "word": "there",
          "lemma": "there",
          "characterOffsetBegin": "41",
          "characterOffsetEnd": "46",
          "pos": "RB",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "10",
          "word": "to",
          "lemma": "to",
          "characterOffsetBegin": "47",
          "characterOffsetEnd": "49",
          "pos": "TO",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "11",
          "word": "help",
          "lemma": "help",
          "characterOffsetBegin": "50",
          "characterOffsetEnd": "54",
          "pos": "VB",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "12",
          "word": "her",
          "lemma": "she",
          "characterOffsetBegin": "55",
          "characterOffsetEnd": "58",
          "pos": "PRP",
          "ner": "O",
          "speaker": "PER0"
        },
        {
          "index": "13",
          "word": ".",
          "lemma": ".",
          "characterOffsetBegin": "58",
          "characterOffsetEnd": "59",
          "pos": ".",
          "ner": "O",
          "speaker": "PER0"
        }
      ]
    }
  ]
}

"""
use corenlp server (see https://github.com/erindb/corenlp-ec2-startup)
to parse sentences: tokens, dependency parse
"""
def get_parse(sentence, depparse=True):
    sentence = sentence.replace("'t ", " 't ")
    if depparse:
        url = "http://localhost:12345?properties={annotators:'tokenize,ssplit,pos,depparse'}"
    else:
        url = "http://localhost:12345?properties={annotators:'tokenize,ssplit,pos'}"
    data = sentence
    parse_string = requests.post(url, data=data).text
    return parse_string


class Sentence():
    def __init__(self, json_sentence, original_sentence):
        self.json = json_sentence
        self.dependencies = json_sentence["basic-dependencies"]
        self.tokens = json_sentence["tokens"]
        self.original_sentence = original_sentence

    def indices(self, word):
        if len(word.split(" ")) > 1:
            words = word.split(" ")
            indices = [i for lst in [self.indices(w) for w in words] for i in lst]
            return indices
        else:
            return [i+1 for i in get_indices([t["word"] for t in self.tokens], word)]

    def token(self, index):
        return self.tokens[index-1]

    def word(self, index):
        return self.token(index)["word"]

    def find_parents(self, index, filter_types=False):
        deps = self.find_deps(index, dir="parents", filter_types=filter_types)
        return [d["governor"] for d in deps]

    def find_children(self, index, filter_types=False):
        deps = self.find_deps(index, dir="children", filter_types=filter_types)
        return [d["dependent"] for d in deps]

    def find_deps(self, index, dir=None, filter_types=False):
        deps = []
        if dir=="parents" or dir==None:
            deps += [d for d in self.dependencies if d['dependent']==index]
        if dir=="children" or dir==None:
            deps += [d for d in self.dependencies if d['governor']==index]
        if filter_types:
            return [d for d in deps if d["dep"] in filter_types]
        else:
            return deps

    def find_dep_types(self, index, dir=None, filter_types=False):
        deps = self.find_deps(index, dir=dir, filter_types=filter_types)
        return [d["dep"] for d in deps]

    def __str__(self):
        return " ".join([t["word"] for t in self.tokens])

    def get_subordinate_indices(self, acc, explore, exclude_indices=[]):
        children = [c for i in explore for c in self.find_children(i) if not c in exclude_indices]
        if len(children)==0:
            return acc
        else:
            return self.get_subordinate_indices(
                acc=acc + children,
                explore=children,
                exclude_indices=exclude_indices
            )

    def get_phrase_from_head(self, head_index, exclude_indices=[]):

        # given an index,
        # grab every index that's a child of it in the dependency graph
        subordinate_indices = self.get_subordinate_indices(
            acc=[head_index],
            explore=[head_index],
            exclude_indices=exclude_indices
        )
        subordinate_indices.sort()

        # make string of subordinate phrase from parse
        parse_subordinate_string = " ".join([self.word(i) for i in subordinate_indices])

        # correct subordinate phrase from parsed version to wikitext version
        # (tokenization systems are different)
        orig_words = self.original_sentence.split()
        parsed_words = [t["word"] for t in self.tokens]

        subordinate_phrase = extract_subphrase(orig_words, parsed_words, subordinate_indices)

        # make a string from this to return
        return subordinate_phrase

sentence_obj = Sentence(parse["sentences"][0], sentence)
print(sentence_obj)
print(sentence_obj.token(5))
print(sentence_obj.token(3))

"""
There is a sym link to this file. This file exports a single function:

process_parsed_data

def process_parsed_data(parse):
  return "hello"
"""