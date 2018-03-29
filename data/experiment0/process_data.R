source("~/Settings/startup.R")
library(rjson)

directory = "disease_whybot_2"

read_a_json_file = function(filename) {
  data = do.call(rbind, lapply(readLines(filename), function(line) {
    minidf = as.data.frame(fromJSON(line), stringsAsFactors=F)
    return(minidf)
  })) %>% as.data.frame
  return(data)
}

# df = data.frame()
# for (linenum in 1:length(readLines(filename))) {
#   line = readLines(filename)[[linenum]]
#   print(linenum)
#   minidf = as.data.frame(fromJSON(line), stringsAsFactors=F)
#   df = rbind(df, minidf)
# }

files = list.files(directory)
files = files[files!="empty.txt"]
files = files[files!="nonsense.txt"]

names = c()

read_data_for_a_user = function(username) {
  print(username)
  data_file = paste(directory, "/", username, ".txt", sep="")
  subject_filename = paste(username, "_subject.txt", sep="")
  subject_file = paste(directory, "/", subject_filename, sep="")
  if (subject_filename %in% char(files)) {
    data = merge(read_a_json_file(data_file),
               read_a_json_file(subject_file))
  } else {
    data = merge(read_a_json_file(data_file),
                 data.frame(system.Browser=NA,
                            system.OS=NA, 
                            system.screenH=NA,
                            system.screenW=NA,
                            subject_information.language=NA,
                            subject_information.enjoyment=NA,
                            subject_information.assess=NA,
                            subject_information.age=NA,
                            subject_information.gender=NA,
                            subject_information.education=NA,
                            subject_information.problems=NA,
                            subject_information.fairprice=NA,
                            subject_information.comments=NA,
                            time_in_minutes=NA))
  }
  if (!("subject_information.assess" %in% names(data))) {
    data$subject_information.assess = NA
  }
  new_names = names(data)
  # print(length(names))
  # print(length(new_names))
  # print(length(names)==length(new_names))
  if (length(names)>length(new_names)) {
    print(setdiff(names, new_names))
  } else if (length(names)<length(new_names)) {
    print(setdiff(new_names, names))
  }
  names <<- new_names 
  return(data)
}

is_subject_data = sapply(files, function(x) {
  components = strsplit(x, "_")[[1]]
  last = components[length(components)]
  return(last=="subject.txt")})
usernames = unlist(strsplit(files[!is_subject_data], ".txt"))

data = do.call(rbind, lapply(usernames, read_data_for_a_user)) %>%
  filter(!(userid %in% c("erindb1", "erindb2")))

# name	he	him	his	userid	system.Browser	system.OS	system.screenH
#system.screenW	subject_information.language	subject_information.enjoyment	
#subject_information.assess	subject_information.age	subject_information.gender
#subject_information.education	subject_information.problems
#subject_information.fairprice	subject_information.comments
#time_in_minutes	A	bSe	bSf	bSo	bSs	C	causeCD	causeDSe	causeDSf
#causeDSo	causeDSs	costA	D	mitigateAD	R	Se	Sf	So	Ss

wide_data = data %>% 
  select(-feedback, -after_text, -before_text, -after, -before,
         -prompt, -n_symptoms, -in_between, -parse_error, -rt,
         -start, -is_valid, -secondary_response, -secondary_response_type,
         -query_type, -trial_level, -time, -transformed_response) %>%
  spread(variable, response)

anonymize = function(df) {
  df$userid = as.numeric(as.factor(df$userid))
  return(df)
}

wide_data %>%
  # anonymize %>%
  write.csv(paste("processed_data_", directory, ".csv", sep=""))

data %>% filter(feedback!="") %>%
  select(before, after, feedback)

wide_data %>% filter(subject_information.comments!="") %>%
  group_by(userid) %>%
  summarise(comments = subject_information.comments) %>%
  as.data.frame %>% flatten

wide_data %>% filter(subject_information.problems!="") %>%
  group_by(userid) %>%
  summarise(comments = subject_information.problems) %>%
  as.data.frame %>% flatten


# data %>% filter(userid=="mdewolf") %>%

# data %>% filter(userid=="abdellah") %>%
#   filter(variable %in% c(
#     "bSe","causeDSf","causeDSs",
#     "bSs","mitigateAD","causeCD","causeDSo","costA","causeDSe",
#     "bSo", "bSf"
#     )
#   ) %>% select(before)






