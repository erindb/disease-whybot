source("~/Settings/startup.R")
library(rjson)

read_a_json_file = function(filename) {
  data = do.call(rbind, lapply(readLines(filename), function(line) {
    as.data.frame(fromJSON(line), stringsAsFactors=F)})) %>% as.data.frame
  return(data)
}

read_data_for_a_user = function(username) {
  print(username)
  data_file = paste("disease_whybot_0/", username, ".txt", sep="")
  subject_file = paste("disease_whybot_0/", username, "_subject.txt", sep="")
  if (subject_file %in% files) {
    data = merge(read_a_json_file(data_file),
               read_a_json_file(subject_file))
  } else {
    data = read_a_json_file(data_file)
  }
  return(data)
}

files = list.files("disease_whybot_0/")
files = files[files!="empty.txt"]
files = files[files!="nonsense.txt"]

is_subject_data = sapply(files, function(x) {
  components = strsplit(x, "_")[[1]]
  last = components[length(components)]
  return(last=="subject.txt")})
usernames = unlist(strsplit(files[!is_subject_data], ".txt"))

data = do.call(rbind, lapply(usernames, read_data_for_a_user))

subject_level = data %>% group_by(userid) %>%
  summarise(comments=subject_information.comments[[1]],
            problems=subject_information.problems[[1]],
            time_in_minutes=time_in_minutes[[1]]) %>%
  as.data.frame 
subject_level %>% t

simple_data = data %>%
  filter(!(userid %in% c("erindb", "nonsense"))) %>%
  mutate(variable = ifelse(variable %in% c("Ss", "Se", "Sf", "So"), "S", variable)) %>%
  filter(variable %in% c("D", "C", "S", "A")) 

simple_data %>%
  filter(variable=="D") %>%
  ggplot(., aes(x=response)) +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))
ggsave("illnesses.png", height=3, width=5)
simple_data %>%
  filter(variable=="C") %>%
  ggplot(., aes(x=response)) +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))
ggsave("causes.png", height=5, width=5)
simple_data %>%
  filter(variable=="S") %>%
  ggplot(., aes(x=response)) +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))
ggsave("symptoms.png", height=5, width=5)
simple_data %>%
  filter(variable=="A") %>%
  ggplot(., aes(x=response)) +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))
ggsave("treatments.png", height=3, width=5)

simple_data %>%
  ggplot(., aes(x=response)) +
  facet_wrap(~variable, scale="free") +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))
ggsave("responses.png", height=10, width=8)

subset_illnesses = c("lymphoma", "cancer")
subset_users = (simple_data %>%
  filter(variable=="D" & response%in%subset_illnesses))$userid
simple_data %>% filter(userid %in% subset_users) %>%
  ggplot(., aes(x=response)) +
  facet_wrap(~variable, scale="free") +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))

subset_illnesses = c("a cold", "the flu")
subset_users = (simple_data %>%
                  filter(variable=="D" & response%in%subset_illnesses))$userid
simple_data %>% filter(userid %in% subset_users) %>%
  ggplot(., aes(x=response)) +
  facet_wrap(~variable, scale="free") +
  geom_bar() +
  theme(axis.text.x=element_text(angle = -90, hjust = 0))

subset_users = unique((simple_data %>%
                  filter(variable=="S" & response=="die"))$userid)
subset_illnesses = unique((simple_data %>% filter(userid %in% subset_users) %>%
  filter(variable=="D"))$response)

subset_users = unique((simple_data %>%
                         filter(variable=="S" & response=="cough"))$userid)
subset_illnesses = unique((simple_data %>% filter(userid %in% subset_users) %>%
                             filter(variable=="D"))$response)
subset_illnesses

subset_users = unique((simple_data %>%
                         filter(variable=="S" & response=="vomit"))$userid)
subset_illnesses = unique((simple_data %>% filter(userid %in% subset_users) %>%
                             filter(variable=="D"))$response)
subset_illnesses

subset_users = unique((simple_data %>%
                         filter(variable=="S" & response%in%c(
                           "sleep", "be tired", "be fatigued", "rest")))$userid)
subset_illnesses = unique((simple_data %>% filter(userid %in% subset_users) %>%
                             filter(variable=="D"))$response)
subset_illnesses

subset_illnesses = c("cancer", "lymphoma")
subset_users = unique((simple_data %>%
                         filter(variable=="D" & response%in%subset_illnesses))$userid)
subset_causes = unique((simple_data %>% filter(userid %in% subset_users) %>%
                             filter(variable=="C"))$response)
subset_causes

subset_illnesses = c("the flu", "a cold")
subset_users = unique((simple_data %>%
                         filter(variable=="D" & response%in%subset_illnesses))$userid)
subset_causes = unique((simple_data %>% filter(userid %in% subset_users) %>%
                          filter(variable=="C"))$response)
subset_causes

ggsave("responses.png", height=10, width=8)
table(data %>% filter(variable=="S"))

# data %>% filter(variable=="D") %>% select(userid, response)
# data %>% filter(variable=="C") %>% select(userid, response)
# data %>% filter(variable=="Sf") %>% select(userid, response)
# data %>% filter(variable=="So") %>% select(userid, response)
# data %>% filter(variable=="Se") %>% select(userid, response)
# data %>% filter(variable=="Ss") %>% select(userid, response)
# 
# data %>% filter(feedback %in% c("impossible", "weird")) %>%
#   mutate(sentence = paste(before, response, after, sep=""),
#          query=ifelse(variable %in% c("D", "C", "A", "Sf", "Se", "So", "Ss", "R"),
#            paste(before, "___", after, sep=""),
#            paste(before, after, sep=""))) %>%
#   select(sentence, query)

data %>% group_by(userid) %>% summarise(N=length(userid))

wide_data = data %>% 
  select(response, variable, userid) %>%
  spread(variable, response)

wide_data %>% write.csv("processed_data.csv")
