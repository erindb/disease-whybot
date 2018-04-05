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

encoder = sys.argv[1]#"skip-thoughts"

embeddings_file = "../../data/experiment1/{}_embeddings_mtx.txt".format(encoder)
similarities_file = "../../data/experiment1/{}_cosine_similarities.txt".format(encoder)

sentences = [line[:-1] for line in open("../../data/experiment1/sentences_to_go_with_cosine_similarities.txt").readlines()]

print("reading embeddings file...")
sentence_embeddings = np.loadtxt(embeddings_file)

print("getting cosine similarities...")
sim_matrix = cosine_similarity(sentence_embeddings)

print("writing to file...")
np.savetxt(similarities_file, sim_matrix)

