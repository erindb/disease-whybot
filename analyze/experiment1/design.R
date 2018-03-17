source("~/Settings/startup.R")
df = read.csv("../../data/experiment1/all_data.csv")

attrition_rates = function(df) {
  attrition_df = df %>%
    group_by(workerid) %>%
    summarise(completed = completed[1],
              disease = disease[1]) %>%
    group_by(disease) %>%
    summarise(prop_completed = mean(completed))
  attrition_v = attrition_df$prop_completed
  names(attrition_v) = attrition_df$disease
  return(attrition_v)
}

totals = function(df) {
  total_df = df %>%
    group_by(workerid) %>%
    summarise(completed = completed[1],
              disease = disease[1]) %>%
    group_by(disease) %>%
    summarise(n = length(disease))
  return(total_df$n)
}

completed_rates = function(df) {
  attrition_df = df %>%
    group_by(workerid) %>%
    summarise(completed = completed[1],
              disease = disease[1]) %>%
    group_by(disease) %>%
    summarise(prop_completed = sum(completed))
  attrition_v = attrition_df$prop_completed
  names(attrition_v) = attrition_df$disease
  return(attrition_v)
}

bootstrap = function(df, fn, n=1000, alpha=0.05) {
  samples = sapply(1:n, function(k) {
    resampled_data = df %>%
      group_by(workerid) %>%
      summarise(completed = completed[1],
                disease = disease[1]) %>%
      sample_n(size=nrow(df), replace=T)
    return(fn(resampled_data))
  })
  ci_data = data.frame(t(samples)) %>%
    gather() %>%
    group_by(key) %>%
    summarise(
      ci.low = quantile(value, probs=alpha/2),
      ci.high = quantile(value, probs=1-alpha/2)
    )
  return(merge(ci_data,
               data.frame(t(fn(df))) %>% 
                 gather %>% 
                 rename(actual = value)) %>%
           rename(disease = key))
}

attrition_df = bootstrap(df, attrition_rates) %>%
  rename(proportion_completed = actual) %>%
  mutate(disease = factor(disease, labels=c(
    "diabetes",
    "heart disease",
    "lung cancer",
    "the flu"
  )))

attrition_df %>%
  ggplot(., aes(x=disease, y=proportion_completed)) +
  geom_bar(stat="identity", colour="black", fill="white") +
  geom_errorbar(aes(ymin=ci.low, ymax=ci.high), width=0)

completed_df = bootstrap(df, completed_rates) %>%
  rename(completed = actual) %>%
  mutate(disease = factor(disease, labels=c(
    "diabetes",
    "heart disease",
    "lung cancer",
    "the flu"
  )))

df %>%
  group_by(disease, completed) %>%
  summarise(count = length(disease)) %>%
  ggplot(., aes(x=disease, y=count, fill=completed, colour=completed)) +
  geom_bar(stat="identity", alpha=0.5) +
  scale_fill_brewer(type="qual", palette=6) +
  scale_colour_brewer(type="qual", palette=6) +
  geom_errorbar(data=completed_df,
                aes(x=disease, ymin=ci.low, ymax=ci.high),
                width=0)

count_df = df %>%
  group_by(workerid) %>%
  summarise(completed = completed[1],
            disease = disease[1]) %>%
  group_by(disease, completed) %>%
  summarise(count = length(disease))

ggplot(count_df,
       aes(x=disease, y=count,
           fill=completed, colour=completed)) +
  geom_bar(stat="identity", alpha=0.5) +
  scale_fill_brewer(type="qual", palette=6) +
  scale_colour_brewer(type="qual", palette=6) +
  theme_few(24)
ggsave("conditions.png", width=12, height=7)

# what's the real question here?
# are attrition rates different for different diseases?
anova(lm(completed ~ disease, df  %>%
           group_by(workerid) %>%
           summarise(completed = completed[1],
                     disease = disease[1])))