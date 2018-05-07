graph_structure = (function() {
  transforms = c("p", "n")
  frames = c("C", "R")
  n_link_types = length(transforms)*length(frames)
  
  graph_structure = data.frame(
    transform1 = c(rep(rep(transforms, c(2,2)), 1),
                   rep(rep(transforms, c(8,8)), 1)),
    frame1 = c(rep(rep(frames, c(1,1)), 2),
               rep(rep(frames, c(4,4)), 2)),
    transform2 = c(rep("", n_link_types),
                   rep(rep(transforms, c(2,2)), 4)),
    frame2 = c(rep("", n_link_types),
               rep(rep(frames, c(1,1)), 8)),
    stringsAsFactors=F) %>%
    filter(frame1==frame2 | transform1!=transform2) %>%
    mutate(var1 = paste(transform1, frame1, sep=""),
           var2 = paste(transform2, frame2, sep=""),
           variable = paste(var1, var2, sep="")) %>%
    mutate(source = ifelse(var2=="", "D", var1),
           target = variable,
           link_type = ifelse(var2=="", var1, var2)) %>%
    select(source, target, link_type)
  
  negations = graph_structure %>% 
    # make negation links
    filter(link_type %in% c("nC", "nR")) %>%
    mutate(target = paste("-", source, sep=""),
           link_type = "neg") %>%
    rbind(graph_structure %>% 
            filter(link_type %in% c("nC", "nR")) %>%
            mutate(target = source,
                   source = paste("-", source, sep=""),
                   link_type = "neg"))
  
  # If link type is nC, that means that it caused something to not happen.
  # So it becomes a positive cause of the negation.
  causes_of_negations = graph_structure %>% 
    filter(link_type=="nC") %>%
    mutate(source = paste("-", source, sep=""),
           link_type = "pC")
  
  results_of_negations = graph_structure %>% 
    filter(link_type=="nR") %>%
    mutate(source = paste("-", source, sep=""),
           link_type = "pR")
  
  graph_structure = graph_structure %>%
    filter(!(link_type %in% c("nC", "nR"))) %>%
    rbind(negations) %>% rbind(causes_of_negations) %>%
    rbind(results_of_negations) %>%
    mutate(old_target = target,
           old_source = source,
           target = ifelse(link_type=="pC", old_source, target),
           source = ifelse(link_type=="pC", old_target, source),
           link_type = ifelse(link_type=="pC", "pR", link_type)) %>%
    select(-old_target, -old_source)
  
  reverse_negations = graph_structure %>%
    filter(link_type=="neg") %>%
    mutate(old_target = target,
           old_source = source,
           source = old_target,
           target = old_source) %>%
    select(source, target, link_type)
  
  return(rbind(graph_structure, reverse_negations))
})()

abstract_g = make_graph(as.matrix(graph_structure %>%select(source, target)) %>% t %>% c, directed=T)


# read data from js experiment
raw_df = read.csv("../../data/experiment1/all_data.csv") %>%
  # filter test and unfinished workers
  filter(!(workerid %in% c(3,4,5,6))) %>%
  # cleanup responses
  mutate(response = char(response)) %>%
  mutate(negated_response = gsub("<span class='variable_word (name|he)'>\\{\\{\\}\\}</span>",
                                 "he",
                                 negated_response),
         negated_response = gsub("<span class='variable_word (him)'>\\{\\{\\}\\}</span>",
                                 "him",
                                 negated_response),
         negated_response = gsub("<span class='variable_word (his)'>\\{\\{\\}\\}</span>",
                                 "his",
                                 negated_response)) %>%
  mutate(negated_response = ifelse(variable=="D", paste("not", response), negated_response)) %>%
  select(workerid, response, variable, negated_response)

df = do.call(rbind, lapply(unique(raw_df$workerid), function(worker_to_graph) {
  # filter to a single worker's data
  w = raw_df %>%
    select(response, negated_response, variable, workerid) %>%
    filter(workerid==worker_to_graph) %>%
    filter(!is.na(response))
  # make a mapping from variables to responses
  responses = w$response
  names(responses) = w$variable
  # make a mapping from variables to negated responses
  negated_responses = w$negated_response
  names(negated_responses) = w$variable
  
  edges_df = graph_structure %>%
    # transform from abstract graph to this particular worker's responses
    select(source, target, link_type) %>%
    mutate(source_variable = char(source),
           target_variable = char(target),
           link_type = char(link_type)) %>%
    filter((target_variable %in% w$variable) & (source %in% w$variable)) %>%
    mutate(negated_source = negated_responses[source_variable],
           source = responses[source_variable],
           target = responses[target_variable]) %>%
    mutate(negated_source = ifelse(is.na(negated_source),
                                   paste("NOT(", source, ")", sep=""),
                                   negated_source)) %>%
    # make sure negations have negated_source
    mutate(source = ifelse(link_type=="neg", negated_source, source)) %>%
    select(source, target, link_type) %>%
    unique()
  
  # # make negation links in the other direction
  # edges_df = rbind(edges_df, edges_df %>%
  #                    filter(link_type=="neg") %>%
  #                    mutate(old_source = source, old_target = target) %>%
  #                    mutate(source = old_target, target = old_source) %>%
  #                    select(source, target, link_type))
  
  return(edges_df)
})) %>% unique()

g = make_graph(as.matrix(df %>%select(source, target)) %>% t %>% c, directed=T)
E(g)$label = df$link_type

neg_g = subgraph.edges(g, E(g)[E(g)$label=="neg"], delete.vertices = F)
cause_g = subgraph.edges(g, E(g)[E(g)$label=="pR"], delete.vertices = F)

adjacency_matrix = as_adj(g)
neg_adj = as_adj(neg_g)
cause_adj = as_adj(cause_g)

find_node = function(node_string) {
  return(which(names(V(g))==node_string))
}

node_name = function(i) {
  return(names(V(g)[i]))
}
