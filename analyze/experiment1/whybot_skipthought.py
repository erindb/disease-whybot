#! /usr/bin/env python
# -*- coding: UTF-8 -*-

X = [line[:-1] for line in open("/Users/erindb/Projects/all_projects/whybot/analyze/experiment1/sentences.csv").readlines()]

# X = [line[:-1] for line in open("/Users/erindb/Projects/all_projects/whybot/analyze/experiment1/winning_sentences.csv").readlines()]


import skipthoughts

import sys
reload(sys)
sys.setdefaultencoding('utf8')

model = skipthoughts.load_model()
encoder = skipthoughts.Encoder(model)

encoder_label = "SkipThought"
dims = 4800

data = []

vectors = encoder.encode(X)

for i in range(len(vectors)):
    raw_sentence = X[i]
    embedding = " ".join([str(v) for v in vectors[i]])

    datum = {
        "sentence": raw_sentence,
        "encoder": encoder_label,
        "dims": dims,
        "embedding": embedding
    }
    data.append(datum)

def write_line(w, lst):
    w.write("\t".join([format(x) for x in lst]) + "\n")

output_file = open("data.tsv", "w")

keys = None
for i in range(len(data)):
    d = data[i]
    if i==0:
        keys = d.keys()
        write_line(output_file, keys)
    write_line(output_file, [d[k] for k in keys])



