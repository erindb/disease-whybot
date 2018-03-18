#! /usr/bin/env python

import os
import json
from copy import copy
import pandas as pd
from sys import exit

incomplete_files = [f for f in os.listdir(".") if f[-4:]==".txt"]
complete_files = ["completed/{}".format(f) for f in os.listdir("completed/")]

def extend(data_so_far, datum):
  new_data = copy(data_so_far)
  for key in datum:
    if key not in new_data:
      new_data[key] = []
    new_data[key].append(datum[key])
  return new_data

def parse_file(filename, workerid, complete=False):
  session_dataframes = []
  session_index = 0
  session_data = {}
  trial_index = 0
  lines = open(filename).readlines()
  for line_num, line in enumerate(lines):
    datum = json.loads(line)
    datum["trial_index"] = trial_index
    trial_index += 1
    if "variable" in datum and datum["variable"]=="D":
      session_data["disease"] = datum["response"]
    if "subject_information" in datum:
      for key in datum:
        if type(datum[key]) is dict:
          session_data.update(datum[key])
        else:
          session_data[key] = datum[key]
      session_data["session_index"] = session_index
      session_data["completed"] = "T"
      session_dataframes.append(pd.DataFrame(data = session_data))
      session_data = {}
      trial_index = 0
      session_index += 1
    else:
      session_data = extend(session_data, datum)
  if len(session_dataframes) == 0:
    session_data["completed"] = "F"
    session_dataframes.append(pd.DataFrame(data = session_data))
  subject_data = dict(pd.concat(session_dataframes))
  subject_data["workerid"] = workerid
  return pd.DataFrame(data=subject_data)

subject_dataframes = []
for workerid, filename in enumerate(incomplete_files+complete_files):
  subject_data = parse_file(filename, workerid)
  subject_dataframes.append(subject_data)

all_data = pd.concat(subject_dataframes)
all_data = all_data.drop('userid', 1)

all_data.to_csv("../../../data/experiment1/all_data.csv")
