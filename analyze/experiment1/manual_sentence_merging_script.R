## This is an interactive script for tagging synonymous sentences manually
## The script iterates through sentences, presenting potential synonyms from most similar
## to least similar, using sentence vector distances. 
##
## A few notes:
##
## (1) Sentences that are already merged are not presented as candidates
##
## (2) Script presents up to 50 candidates, but will exit out early for a sentence 
## if 4 candidates in a row were tagged non-synonyms.
##
## (3) If the script is stopped, it will save the progress and can be resumed.
##
## Unfortunately, it's hard to test a script like this! I'm also not sure how
## long coding will take--it depends partly on how many synonyms are found

## Also, we should probably not consider the disease labels ("diabetes", "lung cancer", etc) for merging

## Author: Derek
## Updated: 4/13/18, 12:02 PM

# # ----------------------------------------


library(tidyr)
library(dplyr)
library(ggplot2)
library(igraph)
library(ggthemes)
char = as.character
num = function(x) {return(as.numeric(as.character(x)))}
library('Matrix')

sentences <- read.delim("../../data/experiment1/sentences_to_go_with_cosine_similarities.txt",
  sep = "~",
  stringsAsFactors = F,
  header = F
)$V1

X = read.table("../../data/experiment1/dissent_cosine_similarities.txt")

V = do.call(c, as.list(X))
M = matrix(V, nrow = nrow(X), dimnames = list(sentences, sentences))

get_similar <- function(index, n=20) {
  ## gets 20 most similar sentences (w/ similarity)
  ## while accounting for negation
  ## uses a crude heuristic:
  ## detects presence of negation in sentence
  ## compares only to sentences w/ same negation status
  
  i <- index
  negation_words <- c(
    "n't",
    "\\<not",
    "\\<cannot",
    "\\<never",
    "\\<didnt",
    "\\<no",
    "\\<doesnt",
    "\\<cant",
    "\\<wont",
    "\\<shouldnt",
    "\\<couldnt",
    "\\<dont"
    
  )
  
  neg_search <- paste0("(", paste0(negation_words, collapse = "|"), ")")
  # SPLIT sentences into two -- one set w/ negation, one w/out negations
  
  neg_sentences_ind <- grepl(neg_search, sentences)
  pos_sentences_ind <- !grepl(neg_search, sentences)
  
  Row <- M[i, ]
  
  if (neg_sentences_ind[i]) {
    sort(Row[neg_sentences_ind], decreasing = TRUE)[1:n]
  } else {
    sort(Row[pos_sentences_ind], decreasing = TRUE)[1:n]
  }
}

## I think I could make this work better if I just propogate through the synonymy when I record the responses 
## So when S1 is synonymous with S2, also add entries for S1 synonymous with all of S2's synonyms
## That would accomplish this root thing more cleanly.

# get_root_sentences <- function(merged_df, candidate_sentences) {
#   # for the candidate sentences 
#   
#   # see if they've already been merged
#   merged_sentences <- unique(merged_df$sentence2)
#   already_merged <- candidate_sentences[which( (candidate_sentences %in% merged_sentences))]
#   processed_candidates <- candidate_sentences[which( !(candidate_sentences %in% merged_sentences))]
#   
#   # get the sentences they're each merged with
#   
#   for (sentence in already_merged) {
#     
#     merges <- merged_df %>%
#       filter(sentence2 == sentence, synonym == 1)
#     
#     # consider the original "head" sentence as candidate for merging
#     head_sentence <- merges$sentence1[1] %>% as.character()
#     processed_candidates <- c(processed_candidates, head_sentence)
#   }
#   
#   # return unique candidates
#   candidates <- unique(processed_candidates)
#   
# }

## ----------------------------------------
# grab small set of sentences for testing

sentences <- sentences[c(1,4, 7, 8, 11, 20, 21, 23, 22,50)]
M <- M[c(1,4, 7, 8, 11, 20, 21, 23, 22,50),c(1,4, 7, 8, 11, 20, 21, 23, 22,50)]

if ("sentence_merging_data.csv" %in% list.files()) {

  df_output <- read.csv("sentence_merging_data.csv")

  } else {
  
  df_output <- data.frame()
  
}


response <- -1
iter_num <- 0

for (i in 1:length(sentences)) {
  
  if (response == 3) break
  
  orig_sentence <- sentences[i]
  similar_sentences <- names(get_similar(i, 9)[2:9])
  similar_sentences <- similar_sentences[which(!is.na(similar_sentences)) ]
  unmerged_tally <- 0
  existing_entries <- data.frame()
  
  # testing new approach, uncomment to go back
  if (nrow(df_output) > 0) {

    # for each already merged sentence, only consider 1 of the synonymous sentences as a candidate
    # similar_sentences <- get_root_sentences(df_output, similar_sentences)

  }
  
  for (candidate in similar_sentences) {
    

    if (orig_sentence %in% c("diabetes", "lung cancer", "the flu", "")) {break} # <--- ADD 4th SEED
    
    existing_entries <- df_output %>% filter((sentence1 == orig_sentence & sentence2 == candidate) ||
                                               (sentence2 == orig_sentence & sentence1 == candidate))
    
    # maybe add showing sentence number and iteration number?

    if (nrow(existing_entries) > 0) break

    if (orig_sentence %in% c("diabetes", "lung cancer", "the flu", "")) break # <--- ADD 4th SEED
    
    if (!is.null(df_output)) {
      # maybe add showing sentence number and iteration number?
      existing_entries <- df_output %>% filter(sentence1 == orig_sentence, sentence2 == candidate)
      
      if (nrow(existing_entries) > 0) break
    }
    
    cat("\014") # clear console
    cat(paste0("Response 1: ", orig_sentence,"\n","Response 2: ", candidate,"\n\n"))
    
    response <- utils::menu(c("merge","keep separate","quit"), title = "Should responses be merged?")
    
    ## --- check response
    if (response == 3) break
    
    if (response == 2) {
      unmerged_tally <- unmerged_tally + 1
      
      if (unmerged_tally > 4) {
        break
      }
    }
    
    if (response == 1) {
      unmerged_tally <- 0
    }
    
    ## --- record response
    # record symmetrically
    iter_df <- data.frame(sentence1 = c(orig_sentence, candidate),
                          sentence2 = c(candidate, orig_sentence),
                          synonym = rep(ifelse(response == 1, 1, 0),2))
    
    # iter_df <- data.frame(sentence1 = orig_sentence, 
    #                       sentence2 = candidate, 
    #                       synonym = ifelse(response == 1, 1, 0))
    
    # # new approach
    other_synonyms <- df_output %>%
      filter(sentence1 == candidate) %>%
      # filter(synonym == 1) %>%
      mutate(sentence1 = orig_sentence) %>%
      bind_rows(
        df_output %>%
          filter(sentence2 == candidate) %>%
          # filter(synonym == 1) %>%
          mutate(sentence2 = orig_sentence)
      ) %>% distinct() # not sure why I need this?
    
    iter_df <- bind_rows(iter_df, other_synonyms)

    
    if (is.null(df_output)) {
      df_output <<- iter_df
    } else {
      df_output <<- bind_rows(df_output, iter_df)
    }
    

  }
}

write.csv(df_output, "sentence_merging_data.csv", row.names = FALSE)
