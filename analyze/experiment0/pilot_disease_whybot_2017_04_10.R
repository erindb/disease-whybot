source("~/Settings/startup.R")
library(igraph)

df = read.csv("../data/pilot_disease_whybot_2017_04_10_wide_form.csv")

df %>% ggplot(., aes(x=D)) +
  geom_bar() +
  ggtitle("illnesses") +
  theme(axis.text.x=element_text(angle = -90, hjust = 0)) +
  xlab("")