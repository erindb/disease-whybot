var DEBUG = true;
var debug = function(string) {
  if (DEBUG) {console.log(string)};
};

var experiment_label = "disease_whybot_3";
// for data collection

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

var userid = QueryString.assignmentId ? QueryString.assignmentId : "unkown_user";

var example_parser_callback = function(response, status, data) {
  var response_string = response;
  if (status=="success") {
    var parse = data;
  } else if (status=="failure") {
  } else {
    console.log("error 98237402q");
  }
};

var get_nlp_data = function(response, full_sentence, callback) {
  debug(full_sentence);
  var properties = {annotators: "tokenize,ssplit,pos,depparse"};
  var property_string = JSON.stringify(properties);
  var properties_for_url = encodeURIComponent(property_string);
  $("#processing").show();
  $.ajax({
    type: "POST",
    url: 'https://' +
      'rxdhawkins.me:400/' +
      '?properties=' +
      properties_for_url,
    data: full_sentence,
    success: function(data) {
      $("#processing").hide();
      console.log(JSON.parse(data));
      callback(response, "success", JSON.parse(data));
    },
    error: function (responseData, textStatus, errorThrown) {
      $("#processing").hide();
      console.log('POST failed.');
      callback(response, "failure");
    },
    timeout: 2000
  });
};

var valid_numeric_response = function(response) {
  var isValidIntegerRE = /^(1000|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var isValidInteger = isValidIntegerRE.test(response);
  return isValidInteger;
};

var collect_response = function() {};

var irregular_verbs = {
  does: "do",
  is: "are",
  has: "have",
  was: "were",
  "'s": "'re",
  "doesn't": "don't",
  "isn't": "aren't",
  "hasn't": "haven't",
  "wasn't": "weren't"
};
var irregular_verbs_list = Object.keys(irregular_verbs);

var isTheyPron = function(word) {
  return (word.match(/s?he/i) || word==exp.variables.name);
};

var index = function(s) {
  return parseInt(s)-1;
};

// ------------ VERBS ------------

// 1. find verbs with "(s)he" as a subject
// 2. convert verbs
//    a. is it irregular? if so, lookup table
//    b. (else) does it end in ies? oes? es? s?

var transform_verb = function(verb) {
  var ends_with_ies = verb.slice(verb.length-3, verb.length) == "ies";
  var ends_with_oes = verb.slice(verb.length-3, verb.length) == "oes";
  var ends_with_es = verb[verb.length-1] == "es";
  var ends_with_s = verb[verb.length-1] == "s";
  if (irregular_verbs_list.indexOf(verb)>=0) {
    return irregular_verbs[verb];
  } else if (ends_with_ies) {
    return verb.slice(0, verb.length-3) + "y";
  } else if (ends_with_oes) {
    return verb.slice(0, verb.length-3) + "o";
  } else if (ends_with_es) {
    return verb.slice(0, verb.length-2) + "e";
  } else if (ends_with_s) {
    return verb.slice(0, verb.length-1);
  } else {
    return verb;
  }
};

var find_main_predicate = function(dependencies, token, tokens) {
  // if the verb is a governor of some dependency,
  // then the verb will almost certainly govern its subject.
  // in this case, we simply check whether the subject is
  // (s)he.

  // sometimes we have to link
  // aux, auxpass, or cop to a subject.

  // could go via conj
  // could additionally go via aux, cop, etc.

  // search dependencies for a link to a main predicate
  // if you find one, check if *it* has a link to *another*
  // main predicate.
  // if you don't find one, return that token.

  var links = dependencies.filter(function(dependency) {
    return (
      (dependency.dependent==token.index) &&
      (["conj", "aux", "cop", "auxpass"].indexOf(dependency.dep) >= 0)
    );
  }).map(function(dependency) {
    var governor_index = index(dependency.governor);
    var mainer_predicate = tokens[governor_index];
    return mainer_predicate;
  });

  if (links.length==0) {
    return token;
  } else {
    return find_main_predicate(
      dependencies,
      links[0],
      tokens
    );
  }
};

var find_subject_dependency = function(dependencies, token, tokens) {
  // search for an nsubj or nsubjpass dependency
  var subject_dependencies = dependencies.filter(function(dependency) {
    return (
      (dependency.governor == token.index) &&
      (["nsubj", "nsubjpass"].indexOf(dependency.dep)>=0)
    )
  });
  if (subject_dependencies.length>0) {
    return subject_dependencies[0];
  } else {
    return false;
  }
};

var has_they_subject = function(dependencies, token, tokens) {
  // here's an even harder version. sometimes we have to
  // deal with conjunctions.

  // some verbs are aux or cop and their connection
  // to their subject is via some root predicate
  var main_predicate = find_main_predicate(dependencies, token, tokens);
  var subject_dependency = find_subject_dependency(
    dependencies,
    main_predicate,
    tokens
  );
  if (subject_dependency) {
    var subject_index = index(subject_dependency.dependent);
    return isTheyPron(tokens[subject_index].word);
  }
  return false;
};

var replace_verbs = function(sentence) {
  var dependencies = sentence["basicDependencies"];
  var tokens = sentence.tokens;

  // filter to only verbs
  var all_verbs = tokens.filter(function(token) {
    return token.pos[0]=="V"
  });

  var verbs_to_replace = [];

  // extract verbs with (s)he as subject
  for (var v=0; v<all_verbs.length; v++) {
    var token = all_verbs[v];
    // find the subject of each verb by looking in the dependency parse
    if (has_they_subject(dependencies, token, tokens)) {
      verbs_to_replace.push(token);
    };
  }

  var new_tokens = tokens;
  for (var v=0; v<verbs_to_replace.length; v++) {
    var verb_to_replace = verbs_to_replace[v];
    var token_index = index(verb_to_replace.index);
    new_tokens[token_index].new_text = transform_verb(
      verb_to_replace.originalText
    );
  }

  return {
    basicDependencies: dependencies,
    tokens: new_tokens
  }
};

// ------------ PRONOUNS ------------
var easy_pronouns = {
  she: "they",
  he: "they",
  him: "them",
  his: "their"
};
var replace_pronouns = function(sentence) {
  // response = response.replace(/\bs?he\b/gi, "they");
  // response = response.replace(/\bhis\b/gi, "their");
  // response = response.replace(/\bhim\b/gi, "them");
    var tokens = sentence.tokens;
    var dependencies = sentence.dependencies;
    var tokens = tokens.map(function(token) {
      var text = token.originalText.toLowerCase();
      if (Object.keys(easy_pronouns).indexOf(text)>=0) {
        token.new_text = easy_pronouns[text];
        return token;
      }
      if (text == "her") {
        var pos = token.pos;
        if (pos == "PRP$") {
          token.new_text = "their";
          return token;
        } else if (pos=="PRP") {
          token.new_text = "them";
          return token;
        } else {
          console.log("warning 239847");
        }
      }
      return token;
    });
    // // find where dependent is her
    // var dependencies = sentence["basicDependencies"];
    // var herPronounTypes = dependencies.filter(function(item) {
    //   return (item.dependentGloss).match(/her/i);
    // }).map(function(item) {return item.dep;});
    // for (var p=0; p<herPronounTypes.length; p++) {
    //   var herPronounType = herPronounTypes[p];
    //   if (herPronounType=="dep" || herPronounType=="nmod") {
    //     response = response.replace(/her/i, "them");
    //   } else if (herPronounType=="nmod:poss") {
    //     response = response.replace(/her/i, "their");
    //   } else {
    //     console.log(herPronounType);
    //   }
    // }
    return {tokens: tokens, basicDependencies: dependencies};
};

var transform_to_3rd_plural = function(parse, response, before) {
  var sentences = parse.sentences;

  var verbs_are_replaced = _.map(sentences, replace_verbs);
  var everything_replaced = _.map(verbs_are_replaced, replace_pronouns);

  var make_sentence_strings = function(sentence) {
    var tokens = sentence.tokens;

    var new_words = tokens.map(function(token) {
      if (token.new_text) {
        return token.before + token.new_text;
      } else {
        return token.before + token.originalText;
      }
    });

    return new_words.join("");
  };

  var full_sentence = everything_replaced.map(make_sentence_strings).join("");

  var n_words_response = response.split(" ").length;
  before = before.replace(/ $/, "");
  var n_words_before = before.split(" ").length;
  var all_words = full_sentence.split(" ");
  var response_words = all_words.slice(n_words_before, n_words_before+n_words_response);
  response = response_words.join(" ");
  response = response.replace(/[.,]$/, "");

  return response;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function open_feedback() {
  $("#wrong").show();
}

function maybe_allow_skip() {
  if ($("#feedback").val() == "impossible") {
  	$("#skip_button").show();
  };
}

function resizeInput() {
  var size = $(this).val().length;
  $(this).attr('size', Math.max(size, 10));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function span(class_string) {
  return "<span class='variable_word " + class_string + "'>{{}}</span>";
}

function spanify(content, class_string, id) {
  var element = $("<span/>", {
    class: class_string,
    id: id
  });
  element.html(content);
  return element;
}
          
function parse_and_continue(datum_index, trial_data, final_callback) {
  // parse data
  var datum = trial_data[datum_index];
  var response = datum.response;
  var full_sentence = datum.before_text + response + datum.after_text;
  console.log(full_sentence);
  get_nlp_data(
    response,
    full_sentence,
    function(response, status, parse) {
      console.log(response);
      console.log(parse);
      if (status=="success") {
        console.log("post succeeded");
        var transformed_response = transform_to_3rd_plural(parse, response, datum.before_text);
        datum.transformed_response = transformed_response;
        datum.parse_error = false;
      } else if (status=="failure") {
        console.log("post failed");
        datum.transformed_response = response;
        datum.parse_error = true;
      } else {
        console.log("error -21938409238r");
      }
      exp.variables[datum.variable + "_transformed_to_they"] = datum.transformed_response;
      // now we have the transformed response,
      // or some stand-in, for one more response
      // and we have converted all_data accordingly.
      if (datum_index==(trial_data.length-1)) {
        final_callback(true, trial_data);
      } else {
        parse_and_continue(
          datum_index+1,
          trial_data,
          final_callback
        );
      }
    }
  );
};

var level0 = [
  {
    query_type: "text",
    trial_level: 0,
    variable: "D",
    before: (span("name") + " has an illness. " +
              span("HHe") + " has "),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  }
];
var level1 = [
  {
    query_type: "text",
    trial_level: 1,
    variable: "C",
    before: (
      span("name") + " "
    ),
    after: (
      ", which is why " +
      span("he") + " has " + span("D") + "."
    ),
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 1,
    variable: "A",
    before: (
      span("name") + " has " + span("D") + 
      ". If " + span("he") + " "
    ),
    after: (
      ", then " +
      span("he") + " might get better."
    ),
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "symptoms_text",
    trial_level: 1,
    variable: "S",
    before: (
      span("name") + " has " +
      span("D") + " and this will cause " +
      span("him") + " to "
    ),
    n_symptoms: 3,
    in_between: " ",
    after: ".",
    prompt: "NA"
  },
  {
    query_type: "frequency",
    trial_level: 1,
    variable: "D_lifetime",
    prompt: (
      "Out of 1000 people," +
      " about how many will ever get " +
      span("D_transformed_to_they") + " in their lifetime?"
    ),
    after: "NA",
    before: "NA",
    in_between: "NA",
    n_symptoms: "NA"
  },
  {
    query_type: "frequency",
    trial_level: 1,
    variable: "D_prevalence",
    prompt: (
      "Out of 1000 people, about how many have " +
      span("D_transformed_to_they") + " right now?"
    ),
    after: "NA",
    before: "NA",
    in_between: "NA",
    n_symptoms: "NA"
  }
];
var level2 = [
  {
    query_type: "text",
    trial_level: 2,
    variable: "R",
    before: (
      span("name") + " has " + span("D") +
      ". It would help if " + span("he") +
      " " + span("A") +
      ". If " + span("he") + 
      " does not do that, it's probably because " +
      span("he") + " "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "frequency",
    trial_level: 2,
    variable: "CD",
    prompt: (
      "Suppose 100 people " + span("C_transformed_to_they") +
      ". How many will get " + span("D_transformed_to_they") +
      "?"
    ),
    after: "NA",
    before: "NA",
    in_between: "NA",
    n_symptoms: "NA"
  },
  {
    query_type: "frequency",
    trial_level: 2,
    variable: "bD",
    prompt: (
      "Suppose 100 people have " + span("D_transformed_to_they") +
      " and they <b>do not</b> " + span("A_transformed_to_they") +
      ". How many will get better?"
    ),
    after: "NA",
    before: "NA",
    in_between: "NA",
    n_symptoms: "NA"
  },
  {
    query_type: "frequency",
    trial_level: 2,
    variable: "AD",
    prompt: (
      "Suppose 100 people have " + span("D_transformed_to_they") +
      " and they " + span("A_transformed_to_they") +
      ". How many will get better?"
    ),
    after: "NA",
    before: "NA",
    in_between: "NA",
    n_symptoms: "NA"
  },
  {
    query_type: "symptom_frequency",
    trial_level: 2,
    n_symptoms: 3,
    variable: "DS",
    prompt: (
      "Suppose 100 people have " + span("D_transformed_to_they") +
      ". How many of them will..."
    ),
    after: "NA",
    before: "NA",
    in_between: "NA"
  },
  {
    query_type: "symptom_frequency",
    trial_level: 2,
    n_symptoms: 3,
    variable: "bS",
    prompt: (
      "Suppose 100 people <b>do not</b> have " + span("D_transformed_to_they") +
      ". How many of them will..."
    ),
    after: "NA",
    before: "NA",
    in_between: "NA"
  },
  {
    query_type: "difficulty",
    trial_level: 2,
    variable: "cost",
    prompt: (
      span("name") + " has " + span("D") +
      " and if " + span("he") + " " + span("A") +
      ", then " + span("he") + " might get better." +
      " How difficult is it for " + span("him") +
      " to do that?"
    ),
    after: "NA",
    before: "NA",
    in_between: "NA",
    n_symptoms: "NA"
  }
];

function get_exp_length() {
  // console.log("get exp length not implemented");
  return (
    1 + //instructions
    1 + //checkbox
    level0.length + //disease
    level1.length + //level 1
    level2.length + //level 2
    1 //+ //demographics
    //1 //thanks
  )
};

function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
      $("#total-num").html(exp.numTrials);
      $("#total-time").html(7);
     }
  });

  slides.instructions = slide({
    name : "instructions",
    start : function() {
      $(".err").hide();
      exp.hasty_subject = false;
    },
    button : function() {
      document.onkeydown = function(event) {
        if(event.keyCode == '13') {
          _s.button();
        }
      };
      if ($("#read_instructions").is(':checked')) {
        exp.go(); //use exp.go() if and only if there is no "present" data.
      } else {
        exp.hasty_subject = true;
        $(".err").show();
      }
    }
  });

  slides.trial = slide({
    name: "trial",

    present : _.shuffle(level0).concat(
      _.shuffle(level1).concat(
        _.shuffle(level2)
      )
    ),

    present_handle : function(stim) {

      this.startTime = Date.now();
      this.stim = stim;

      $(".err").hide();
      $("#processing").hide();
      $("#skip_button").hide();
      $("#wrong").hide();

      var query_type = stim.query_type;

      var setup_query;
      var setup_response_handlers;
      var setup_interface;
      if (query_type=="text") {
        $(".prompt").html("Fill in the blank.");
          setup_query = function() {
            var response_element;
            if (_s.stim.variable!="D") {
              response_element = $(
                "<input>",
                {
                  id: "response",
                  type: "text"
                }
              ).attr('size',10);
            } else {
              response_element = $("<span>", {id: "response", text: exp.disease})
            }
            $(".query_wrapper").empty();
            $(".query_wrapper").append(
              $("<p/>", {class: "query"})
            );
            $(".query").append(spanify(
              stim.before,
              "before",
              "before_" + stim.variable
            ));
            $(".query").append(response_element);
            $(".query").append(spanify(
              stim.after,
              "after",
              "after_" + stim.variable
            ));
          };
        if (_s.stim.variable=="D") {
          $(".prompt").html("Read the following sentence.");
        };
        setup_interface = function() {
          $("#response").focus();
          $('input[type="text"]')
            // event handler
            .keyup(resizeInput)
            // resize on page load
            .each(resizeInput);
        };
        setup_response_handlers = function() {
          _s.response_handlers[stim.variable] = function() {
            var response;
            var feedback;
            if (_s.stim.variable=="D") {
              response = exp.disease;
              feedback = "NA";
            } else {
              response = $("#response").val();
              feedback = $("#feedback").val();
            }
            console.log(response);
            exp.variables[_s.stim.variable] = response;
            var is_valid = response.length > 0;
            return {
              response: response,
              is_valid: is_valid,
              feedback: feedback,
              secondary_response: "NA",
              secondary_response_type: "NA"
            };
          };
        };
      } else if (query_type=="symptoms_text") {
        $(".prompt").html(
          "Fill in the blanks in " + stim.n_symptoms +
          " different ways."
        );
        setup_query = function() {
          $(".query_wrapper").empty();

          _.forEach(
            _.range(0, stim.n_symptoms),
            function(i) {

              var query = $("<p/>", {class: "query"});

              query.append(spanify(
                stim.before,
                "before",
                "before_" + stim.variable + i
              ));

              query.append(
                $(
                  "<input>",
                  {
                    id: "response" + i,
                    type: "text"
                  }
                ).attr('size',10)
              );

              query.append(spanify(" "));

              var dropdown = $("<select/>", {id: "adverb" + i});
              // To Do: scramble all but first in list
              var adverbs = [
                "",
                "frequently",
                "soon",
                "eventually",
                "occasionally"
              ];
              _.forEach(adverbs, function(adverb) {
                dropdown.append($(
                  "<option/>",
                  {value: adverb, text: adverb}
                ));
                query.append(dropdown);
              });

              query.append(spanify(
                stim.after,
                "after",
                "after_" + stim.variable + i
              ));

              $(".query_wrapper").append(query);
            }
          );
        };
        setup_interface = function() {
          $("#response0").focus();
          $('input[type="text"]')
            // event handler
            .keyup(resizeInput)
            // resize on page load
            .each(resizeInput);
        };
        setup_response_handlers = function() {
          _.forEach(_.range(0, stim.n_symptoms), function(i) {
            _s.response_handlers["S" + i] = function() {
              var response = $("#response" + i).val();
              var adverb = $("#adverb" + i).val();
              var feedback = $("#feedback").val();
              exp.variables["S" + i] = response;
              exp.variables["S" + i + "_adverb"] = adverb;
              var is_valid = response.length>0 & adverb.length>0;
              return {
                response: response,
                is_valid: is_valid,
                feedback: feedback,
                secondary_response: adverb,
                secondary_response_type: "adverb",
                variable: stim.variable + i
              };
            };
          });
        };
      } else if (query_type=="frequency") {
        $(".prompt").html(stim.prompt);
        setup_query = function() {
          $(".query_wrapper").empty();

          var slider_wrapper = $("<div/>", {
            class: "slider_wrapper"
          });
          var left = $(
            "<div/>",
            {class: "left", text: "no one"}
          );
          var right = $(
            "<div/>",
            {class: "right", text: "everyone"}
          );
          var single_slider = $(
            "<div/>",
            {class: "slider frequency_slider", id: "frequency_slider"
          });
          slider_wrapper.append(left);
          slider_wrapper.append(right);
          slider_wrapper.append(single_slider);

          $(".query_wrapper").append(slider_wrapper);

          exp.sliderPost = null;
          utils.make_slider(
            "#frequency_slider",
            function(event, ui) {
              exp.sliderPost = ui.value;
            },
            "horizontal",
            0.001,
            400,
            5
          );
        };
        setup_interface = function() {};
        setup_response_handlers = function() {
          _s.response_handlers[stim.variable] = function() {
            var response = exp.sliderPost;
            var feedback = $("#feedback").val();
            exp.variables[stim.variable] = response;
            var is_valid = response != null;
            return {
              response: response,
              is_valid: is_valid,
              feedback: feedback,
              secondary_response: "NA",
              secondary_response_type: "NA"
            };
          };
        };
      } else if (query_type=="symptom_frequency") {
        setup_query = function() {
          $(".prompt").html(stim.prompt);
          $(".query_wrapper").empty();
          exp.sliderPost = {};
          $(".query_wrapper").append(
            $("<div/>", {class: "symptom_wrapper"})
          );
          _.range(0, stim.n_symptoms).forEach(function(i) {
            var variable_label = "S" + i;
            $(".symptom_wrapper").append($(
              "<p/>",
              {
                class: "symptom",
                id: "symptom" + i,
                text: (
                  "... " +
                  exp.variables[variable_label + "_transformed_to_they"] +
                  " " +
                  exp.variables[variable_label + "_adverb"] +
                  "?"
                )
              }
            ));
            var slider_wrapper = $("<div/>", {
              class: "slider_wrapper"
            });
            var left = $(
              "<div/>",
              {class: "left", text: "no one"}
            );
            var right = $(
              "<div/>",
              {class: "right", text: "everyone"}
            );
            var single_slider = $(
              "<div/>",
              {
                class: "slider frequency_slider",
                id: "frequency_slider" + i
              }
            );
            slider_wrapper.append(left);
            slider_wrapper.append(right);
            slider_wrapper.append(single_slider);

            $(".symptom_wrapper").append(slider_wrapper);

            utils.make_slider(
              "#frequency_slider" + i,
              function(event, ui) {
                exp.sliderPost[i] = ui.value;
              },
              "horizontal",
              0.001,
              400,
              5
            );
          });
        };
        setup_interface = function() {};
        setup_response_handlers = function() {
          _.forEach(_.range(0, stim.n_symptoms), function(i) {
            _s.response_handlers[_s.stim.variable + i] = function() {
              var response = exp.sliderPost[i];
              var feedback = $("#feedback").val();
              var is_valid = response!=null;
              return {
                response: response,
                is_valid: is_valid,
                feedback: feedback,
                secondary_response: "NA",
                secondary_response_type: "NA",
                variable: _s.stim.variable + i
              };
            };
          });
        };
      } else if (query_type=="difficulty") {
        $(".prompt").html(stim.prompt);
        setup_query = function() {
          $(".query_wrapper").empty();

          var slider_wrapper = $("<div/>", {
            class: "slider_wrapper"
          });
          var left = $(
            "<div/>",
            {class: "left", text: "not difficult at all"}
          );
          var right = $(
            "<div/>",
            {class: "right", text: "extremely difficult"}
          );
          var single_slider = $(
            "<div/>",
            {class: "slider frequency_slider", id: "frequency_slider"
          });
          slider_wrapper.append(left);
          slider_wrapper.append(right);
          slider_wrapper.append(single_slider);

          $(".query_wrapper").append(slider_wrapper);

          exp.sliderPost = null;
          utils.make_slider(
            "#frequency_slider",
            function(event, ui) {
              exp.sliderPost = ui.value;
            },
            "horizontal",
            0.001,
            400,
            5
          );
        };
        setup_interface = function() {};
        setup_response_handlers = function() {
          _s.response_handlers[stim.variable] = function() {
            var response = exp.sliderPost;
            var feedback = $("#feedback").val();
            exp.variables[stim.variable] = response;
            var is_valid = response != null;
            return {
              response: response,
              is_valid: is_valid,
              feedback: feedback,
              secondary_response: "NA",
              secondary_response_type: "NA"
            };
          };
        };
      } else {
        console.log("error 1928437-1283");
      }

      function setup_variables() {
        // if we're definitely going to give nonsense to the
        // participant or end up with an error, just keep going.
        var variable_spans = $(".variable_word");
        for (var i=0; i<variable_spans.length; i++) {
          var variable_span = variable_spans[i];
          var variable = $(variable_span).attr("class").split(".")[0].split(" ")[1];
          if (typeof(exp.variables[variable])==undefined ||
            exp.variables[variable]=="") {
            _s.force_continue();
            return false;
          }
        }

        // for each variable, map it to its class
        _.forEach(_.keys(exp.variables), function(variable) {
          $("." + variable).html(exp.variables[variable]);
        });
        return true;
      };

      _s.response_handlers = {};
      setup_query();
      if (setup_variables()) {
        setup_interface();
        setup_response_handlers();
      }
    },

    final_callback: function(success, trial_data) {
      $("#feedback").val("");
      /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      if (success) {
        exp.data_trials = exp.data_trials.concat(trial_data);

        trial_data.forEach(function(datum) {
          var data_log_php_file = "https://rxdhawkins.me/erindb/log_data.php";
          $.get(
            data_log_php_file + 
            "?input=" + 
            encodeURIComponent(
              JSON.stringify(datum)
            ) +
            "&experiment=" + experiment_label +
            "&userid=" + userid
          );
        })

        _stream.apply(_s);
      } else {
        $(".err").show();
      }
      return;
    },

    force_continue : function() {
      console.log("skipping slide! (" + _s.stim.variable + ")")
      _s.rt = (Date.now() - _s.startTime)/1000;
      // _s.log_responses(true);
      _s.final_callback(true);
      return;
    },

    button : function() {
      // this is when we're going to grab the parse
      // which may or may not work and needs its own
      // callback.

      _s.rt = (Date.now() - _s.startTime)/1000;

      var is_valid = true;
      var trial_data = [];
      _.forEach(_.keys(_s.response_handlers), function(variable) {
        var datum = _s.response_handlers[variable]();
        console.log(datum);
        if (datum.is_valid==false) {is_valid=false};
        datum = _.extend(_.clone(_s.stim), datum);
        datum = _.extend(_.clone(datum), {
          transformed_response: "NA",
          parse_error: "NA",
          time: Date.now(),
          rt: _s.rt,
          userid: userid,
          start: exp.startT,
          before_text: $("#before_" + variable).text(),
          after_text: $("#after_" + variable).text()
        });
        // stim variable is less specific
        // than this response-handler variable.
        datum.variable = variable;
        trial_data.push(datum);
      });
      if (is_valid) {
        if (_s.stim.query_type=="text" ||
                _s.stim.query_type=="symptoms_text") {
          // try to parse the text, then run final callback
          parse_and_continue(
            0,
            trial_data,
            _s.final_callback
          );
          return;
        } else {
          _s.final_callback(true, trial_data);
          return;
        }
      } else {
        _s.final_callback(false, trial_data);
        return;
      }
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        assess : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val(),
        comments : $("#comments").val(),
        experiment_name: exp.name,
        experiment_gender: exp.gender,
        hasty_subject: exp.hasty_subject
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {

      var subject_data_to_log = {
        "system" : exp.system,
        "subject_information" : exp.subj_data,
        "start": exp.startT,
        "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      var data_log_php_file = "https://rxdhawkins.me/erindb/log_data.php";
      $.get(
        data_log_php_file + 
        "?input=" + 
        encodeURIComponent(
          JSON.stringify(subject_data_to_log)
        ) +
        "&experiment=" + experiment_label +
        "&userid=" + userid + "_subject"
      );

      exp.data = {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };

      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {

  repeatWorker = false;
  (function(){
      var ut_id = "erindb-whybot-20170413";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();

  $('input[type="text"]')
    // event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);

  exp.trials = [];
  exp.catch_trials = [];

  exp.instructions = "instructions";

  // var ntrials = stims.length;
  var ntrials = 11;

  exp.numTrials = ntrials;

  exp.system = {
    Browser : BrowserDetect.browser,
    OS : BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };

  exp.disease = _.sample(["a cold", "cancer", "depression", "diabetes"]);

  exp.structure = [
    "i0",
    "instructions",
    "trial",
    "subj_info",
    "thanks"
  ];

  var name = _.sample(["Pat", "Sam", "Taylor", "Alex", "Eli"]);
  var gender = _.sample(["men", "women"]);

  exp.variables = {
    name: name,
    gender: gender
  };

  if (gender == "men") {
    exp.variables.him = "him";
    exp.variables.he = "he";
    exp.variables.his = "his";
  } else if (gender == "women") {
    exp.variables.him = "her";
    exp.variables.he = "she";
    exp.variables.his = "her";
  }
  exp.variables.HHim = capitalizeFirstLetter(exp.variables.him);
  exp.variables.HHis = capitalizeFirstLetter(exp.variables.his);
  exp.variables.HHe = capitalizeFirstLetter(exp.variables.he);

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = get_exp_length();
  //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
