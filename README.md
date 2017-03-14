# disease-whybot

try to elicit intuitive theories about disease from adaptive natural language prompts

## Questions

1. D is a disease.
2. Next level “causes”:
    * Bob has D and this causes him to S.
    * Bob has D because he C.
    * Bob has D, so he should A.
3. Next level “details”:
    * Bob should A, but he doesn’t A, because he R.
    * 1000 people have D. How many will S?
    * 1000 people C. How many will get D?
    * Bob has D and he A. How much does it help that he A?
    * Bob has D. He should A. How difficult is it for him to do that?
4. Next level?
    * Bob has D and this causes him to S. It also causes him to S2.
    * Bob has D because he C, but also because he C2.

## Analsysis

* Do people mention diseases that matter? That are frequent?
* Do people know what the symptoms are? How common they are?
* Do people know what the treatments are? How effective they are?
* Do people know what the causes are? How predictive they are?

## Incremental data logging

The file `log_data.php` contains the initial logic to log data.

Navigating to `http://localhost:8000/log_data.php?input={%22some%22:%20%22data%22}&userid=erindb` will log `{"some": "data"}` to the file `erindb.txt`. If the file exists, it will append. If the file does not exist, it will be created.

## To Do List

* conjunctions, disjunctions, negation
    - e.g. "eats too much and doesn't listen to her doctor or maybe has some precondition"
* run without turk and save data incrementally
* implement sliders