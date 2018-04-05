#! /usr/bin/env python
# -*- coding: UTF-8 -*-

from __future__ import division
from __future__ import print_function
from __future__ import absolute_import

import time

import sys
reload(sys)
sys.setdefaultencoding('utf8')

import matplotlib.pyplot as plt
import numpy as np
from copy import deepcopy as cp
from scipy import spatial
from sklearn.metrics.pairwise import cosine_similarity

import pandas as pd
from sys import exit

data = []

i=-1
previous_embedding = None
header = None

# # winning_sentences = [line[:-1] for line in open("/Users/erindb/Projects/all_projects/whybot/analyze/experiment1/sentences.csv").readlines()]
# winning_sentences = [line[:-1] for line in open("/Users/erindb/Projects/all_projects/whybot/analyze/experiment1/winning_sentences.csv").readlines()]
# # winning_sentences = list(set(winning_sentences))

sentence_embeddings = []
sentences = []
for line in open("data.tsv"):
    i+=1
    lst = line[:-1].split("\t")

    if i == 0:
        header = lst

    else:
        orig_datum = {header[h]: lst[h] for h in range(len(header))}
        # print(orig_datum["sentence"])
        embedding = [float(x) for x in orig_datum["embedding"].split(" ")]
        sentence_embeddings.append(embedding)
        sentences.append(orig_datum["sentence"])

open("sentences_to_go_with_cosine_similarities.txt", "w").write("\n".join(sentences))

sentence_embeddings = np.matrix(sentence_embeddings)
print("getting cosine similarities...")
sim_matrix = cosine_similarity(sentence_embeddings)

print("writing to file...")
np.savetxt("fewer_cosine_similarities.txt", sim_matrix)

