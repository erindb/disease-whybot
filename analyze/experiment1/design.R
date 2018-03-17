source("~/Settings/startup.R")
df = read.csv("../../data/experiment1/all_data.csv")

design_df = df %>%
  group_by(workerid, session_index) %>%
  summarise(completed = completed[1],
            disease = disease[1]) %>%
  as.data.frame

ggplot(design_df,
       aes(x=disease, fill=completed, colour=completed)) +
  geom_bar(stat="count", alpha=0.5) +
  scale_fill_brewer(type="qual", palette=6) +
  scale_colour_brewer(type="qual", palette=6) +
  theme_few(24)
ggsave("conditions.png", width=12, height=7)

bootstrapped_count_df = merge(
  design_df %>%
    group_by(disease) %>%
    summarise(count = length(disease)),
  sapply(1:1000, function(i) {
    sampled_design_df = sample_n(design_df, size=nrow(design_df), replace=T)
    sampled_count_df = (sampled_design_df %>%
                          group_by(disease) %>%
                          summarise(N = length(disease)))
    sampled_counts = sampled_count_df$N
    names(sampled_counts) = sampled_count_df$disease
    return(sampled_counts)
  }) %>% t %>% as.data.frame %>%
    gather %>%
    group_by(key) %>%
    summarise(ci.low=quantile(value, 0.025),
              ci.high=quantile(value, 0.975)) %>%
    as.data.frame %>%
    rename(disease = key)
)

bootstrapped_count_df %>% ggplot(., aes(x=disease, y=count)) +
  geom_bar(stat="identity", alpha=0.5, colour="black") +
  geom_errorbar(aes(ymin=ci.low, ymax=ci.high), width=0.05)

length(unique(df$workerid))
nrow(design_df)

incomplete_df = df %>% filter(completed==F) %>%
  select(workerid, response, disease, trial_index)
incomplete_df = merge(
  incomplete_df,
  incomplete_df %>% group_by(workerid) %>%
    summarise(left_at = max(trial_index))
)
(incomplete_df %>% group_by(workerid) %>%
  summarise(left_at = max(trial_index)))$left_at + 1

# what's the real question here?
# are attrition rates different for different diseases?
anova(lm(completed ~ disease, design_df))
# summary(lm(completed ~ disease, design_df))

completed_design = design_df %>%
  filter(completed==T | workerid=="0") %>%
  group_by(disease) %>%
  summarise(N=length(disease))
sum(completed_design$N)
