var experiment_label = "disease_whybot_1";
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
  var properties = {annotators: "tokenize,ssplit,pos,depparse"};
  var property_string = JSON.stringify(properties);
  var properties_for_url = encodeURIComponent(property_string);
  $("#processing").show();
  $.ajax({
    type: "POST",
    url: 'http://' +
      'ec2-52-53-161-229.us-west-1.compute.amazonaws.com:8080/' +
      '?properties=' +
      properties_for_url,
    data: full_sentence,
    success: function(data) {
      $("#processing").hide();
      callback(response, "success", data);
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
  return word.match(/s?he/i)
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

var replace_verbs = function(sentence) {
  var dependencies = sentence["basicDependencies"];
  var tokens = sentence.tokens;

  console.log(sentence);

  // filter to only verbs
  var all_verbs = tokens.filter(function(token) {
    return token.pos[0]=="V"
  });

  var verbs_to_replace = [];

  // extract verbs with (s)he as subject
  for (var v=0; v<all_verbs.length; v++) {
    var token = all_verbs[v];

    // find the subject of each verb by looking in the dependency parse

    // if the verb is a governor of some dependency,
    // then the verb will almost certainly govern its subject.
    // in this case, we simply check whether the subject is
    // (s)he.
    var governor_dependencies = dependencies.filter(function(dependency) {
      return dependency.governor == token.index;
    });
    for (var g=0; g<governor_dependencies.length; g++) {
      var dependency = governor_dependencies[g];
      var relation_is_subject = ((dependency.dep == "nsubj"));
      var they_dependent = isTheyPron(dependency.dependentGloss);
      if (relation_is_subject && they_dependent) {
        var verb_index = dependency.governor;
        var verb_token = tokens.filter(function(token) { 
          return token.index == verb_index
        })[0];
        verbs_to_replace.push(verb_token);
      }
    }

    // here's the hard version. sometimes we have to link
    // aux, auxpass, or cop to a subject.

    var dependent_dependencies = dependencies.filter(function(dependency) {
      return dependency.dependent == token.index;
    });

    for (var d=0; d<dependent_dependencies.length; d++) {
      var dependency = dependent_dependencies[d];
      var verb_index = dependency.dependent;
      var dep = dependency.dep;
      if (dep=="cop" || dep=="auxpass" || dep=="aux") {
        var predicate = dependency.governor;
        console.log(dependency);
        // search dependencies for the predicate's subject
        var possible_subject_dependencies = dependencies.filter(
          function(possible_predicate_dependency) {

            if (possible_predicate_dependency.governor == predicate) {
              console.log(possible_predicate_dependency);

              if (possible_predicate_dependency.dep=="conj") {
                // negation man. T-T
                console.log("hai")
                var other_verb_index = possible_predicate_dependency.governor;
                var verbs_to_replace_that_match = verbs_to_replace.filter(
                  function(token) {
                    return token.index == other_verb_index;
                  }
                );
                if (verbs_to_replace_that_match.length > 0) {
                  var verb_token = tokens.filter(function(token) { 
                    return token.index == verb_index
                  })[0];
                  verbs_to_replace.push(verb_token);
                }
                return false;
              }

              return (possible_predicate_dependency.dep=="nsubj" ||
                possible_predicate_dependency.dep=="nsubjpass");
            } else {
              return false;
            }
          }
        );
        if (possible_subject_dependencies.length > 0) {
          var subject_index = index(
            possible_subject_dependencies[0].dependent
          );
          var subject = tokens[subject_index].originalText;
          if (isTheyPron(subject)) {
            var verb_token = tokens.filter(function(token) { 
              return token.index == verb_index
            })[0];
            verbs_to_replace.push(verb_token);
          };
        };
      } else if (dep=="conj") {
        var other_verb_index = dependency.governor;
        var verbs_to_replace_that_match = verbs_to_replace.filter(
          function(token) {
            return token.index == other_verb_index;
          }
        );
        if (verbs_to_replace_that_match.length > 0) {
          var verb_token = tokens.filter(function(token) { 
            return token.index == verb_index
          })[0];
          verbs_to_replace.push(verb_token);
        }
      }
      // var relation_is_subject = ((dependency.dep == "nsubj"));
      // var they_dependent = isTheyPron(dependency.dependentGloss);
      // if (relation_is_subject && they_dependent) {
      //   var verb_index = dependency.governor;
      //   var verb_token = tokens.filter(function(token) { 
      //     return token.index == verb_index
      //   })[0];
      //   verbs_to_replace.push(verb_token);
      // }
    }
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

function get_exp_length() {
  console.log("get exp length not implemented");
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
    button : function() {
      document.onkeydown = function(event) {
        if(event.keyCode == '13') {
          _s.button();
        }
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name: "trial",

    present :  [
      {
        before: ( exp.name + " has an illness. " + 
          capitalizeFirstLetter(exp.he) + " has "),
        after: ".",
        variable: "D",
        variable_type: "disease",
        trial_level: "disease",
        query_type: "text"
      }
    ],

    variables: {
    },

    trial_level : "disease",

    present_handle : function(stim) {

      this.startTime = Date.now();
      this.stim = stim;

      $(".err").hide();
      $("#processing").hide();
      $("#skip_button").hide();
      $("#wrong").hide();
      $('input[type="text"]').attr('size', 10);
      $("#qualitative_response").hide();
      $("#response").hide();
      $("#select-response").hide();
      // $("#wrong").

      if (stim.query_type=="text" || stim.query_type=="numeric") {
        $("#response").show();
      } else if (stim.query_type=="dropdown") {
        $("#select-response").show();
      } else if (stim.query_type=="qualitative") {
        // draw sliders
        $("#qualitative_response").show();
        _s.init_sliders();
        exp.sliderPost = null; //erase current slider value
      }

      if (_s.trial_level == "disease") {
        $(".escape").hide();
      } else {
        $(".escape").show();
      }

      $("#response").focus();

      $("#before").html(stim.before);
      $("#after").html(stim.after);
    },

    force_continue : function() {
      this.rt = (Date.now() - this.startTime)/1000;
      var success = this.log_responses(true);
      $("#feedback").val("");

      /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      if (success) {
        _stream.apply(this);
      } else {
        $(".err").show();
      }
    },

    button : function() {
      // this is when we're going to grab the parse
      // which may or may not work and needs its own
      // callback.

      this.rt = (Date.now() - this.startTime)/1000;

      // ----- collect response ----
      var response;
      var is_valid;
      if (_s.stim.query_type=="dropdown") {
        response = $("#select-response").val();
        is_valid = response.length > 0;
      } else if (_s.stim.query_type=="numeric") {
        response = $("#response").val();
        is_valid = valid_numeric_response(response);
        // check that it's a number in the correct range
      } else if (_s.stim.query_type=="qualitative") {
        // get slider response and check validity
        response = exp.sliderPost;
        is_valid = exp.sliderPost != null;
      } else if (_s.stim.query_type=="text") {
        response = $("#response").val();
        is_valid = response.length > 0;
      } else {
        response = $("#response").val();
        is_valid = response.length > 0;
      }

      var final_callback = function(success) {
        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        if (success) {
          _stream.apply(_s);
          $("#feedback").val("");
        } else {
          $(".err").show();
        }
      };

      if (is_valid) {
        if (_s.stim.query_type=="text") {
          var full_sentence = _s.stim.before + response + _s.stim.after;
          get_nlp_data(response, full_sentence, function(response, status, data) {
            if (status=="success") {
              var parse = data;
              var transformed_response = transform_to_3rd_plural(parse, response, _s.stim.before);
              var complex_response = {
                response: response,
                transformed_response: transformed_response
              };
              _s.log_responses(complex_response, "complex");
            } else if (status=="failure") {
              _s.log_responses(response);
            } else {
              console.log("error -21938409238r");
            }
            final_callback(true);
          });
        } else {
          // some other response type
          _s.log_responses(response);
          final_callback(true);
        }
      } else { final_callback(false); };
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function(response, datatype) {
      var datatype = datatype ? datatype : "none";
      if (datatype=="complex") {
        var transformed_response = response.transformed_response;
        // log this stuff somewhere so we can use it later
        response = response.response;
      } else {
        transformed_response = response;
      }
      var feedback = $("#feedback").val();

      // TO DO: check that response parses?
      $("#response").val("");
      _s.variables[this.stim.variable + "_transformed_to_they"] = (transformed_response + "").toLowerCase();
      _s.variables[this.stim.variable] = (response + "").toLowerCase();
      var datum_to_log = {
        response: response,
        variable: this.stim.variable,
        variable_type: this.stim.variable_type,
        before: this.stim.before,
        after: this.stim.after,
        trial: this.stim.trial_level,
        name: exp.name,
        he: exp.he,
        him: exp.him,
        his: exp.his,
        time: Date.now(),
        rt: this.rt,
        feedback: feedback,
        userid: userid,
        start: exp.startT
      };
      exp.data_trials.push(datum_to_log);
      var data_log_php_file = "http://ec2-52-53-161-229.us-west-1.compute.amazonaws.com/log_data.php";
      $.get(
        data_log_php_file + 
        "?input=" + 
        encodeURIComponent(
          JSON.stringify(datum_to_log)
        ) +
        "&experiment=" + experiment_label +
        "&userid=" + userid
      );
      var is_last_cause_trial = _s.trial_level == "causes" && _s.present.length==0;
      if (_s.trial_level == "disease") {
        // Bob has D and this causes him to S.
        // Bob has D because he C.
        // Bob has D, so he should A.
        _s.present = _.shuffle([
          {
            before: (
              exp.name + " has " + _s.variables.D +
              " and this causes " + exp.him + " to "
            ),
            after: " frequently.",
            trial_level: "causes",
            variable: "Sf",
            variable_type: "frequenty symptom",
            query_type: "text"
          },
          {
            before: (
              exp.name + " has " + _s.variables.D +
              " and this causes " + exp.him + " to "
            ),
            after: " occasionally.",
            trial_level: "causes",
            variable: "So",
            variable_type: "occasional symptom",
            query_type: "text"
          },
          {
            before:  (
              exp.name + " has " + _s.variables.D +
              " and soon this will cause " + exp.him +
              " to "
            ),
            after: ".",
            trial_level: "causes",
            variable: "Ss",
            variable_type: "soon symptom",
            query_type: "text"
          },
          {
            before:  (
              exp.name + " has " + _s.variables.D +
              " and eventually this will cause " + exp.him +
              " to "
            ),
            after: ".",
            trial_level: "causes",
            variable: "Se",
            variable_type: "eventual symptom",
            query_type: "text"
          },
          {
            before:  (exp.name + " "),
            after: ", which is why " + exp.he +
            " has " + _s.variables.D + ".",
            trial_level: "causes",
            variable: "C",
            variable_type: "cause",
            query_type: "text"
          },
          {
            before:  (
              exp.name + " has " + _s.variables.D +
              ". If " + exp.he + " "
            ),
            after: (
              " then " + exp.he +
              " might get better."
            ),
            trial_level: "causes",
            variable: "A",
            variable_type: "action",
            query_type: "text"
          }
        ]);
        _s.trial_level = "causes";
        return true;
      } else if (is_last_cause_trial)  {
         _s.present = _.shuffle([
            {
              // It would help if Bob A. If he does not do that, it’s probably because he R.
              before:  (
                exp.name + " has " + _s.variables.D +
                ". It would help if " + exp.he +
                " " + _s.variables.A +
                ". If " + exp.he + " does not do that, it's probably because " + exp.he + " "
              ),
              after: ".",
              trial_level: "details",
              variable: "R",
              variable_type: "reason",
              query_type: "text"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.Sf_transformed_to_they +
                " frequently?"),
              after: "",
              trial_level: "details",
              variable: "causeDSf",
              variable_type: "disease->frequent symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.So_transformed_to_they +
                " occasionally?"),
              after: "",
              trial_level: "details",
              variable: "causeDSo",
              variable_type: "disease->occasional symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.Ss_transformed_to_they +
                " soon?"),
              after: "",
              trial_level: "details",
              variable: "causeDSs",
              variable_type: "disease->soon symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.Se_transformed_to_they +
                " eventually?"),
              after: "",
              trial_level: "details",
              variable: "causeDSe",
              variable_type: "disease->eventually symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.Sf_transformed_to_they +
                " frequently?"),
              after: "",
              trial_level: "details",
              variable: "bSf",
              variable_type: "!disease->frequent symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.So_transformed_to_they +
                " occasionally?"),
              after: "",
              trial_level: "details",
              variable: "bSo",
              variable_type: "!disease->occasional symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.Ss_transformed_to_they +
                " soon?"),
              after: "",
              trial_level: "details",
              variable: "bSs",
              variable_type: "!disease->soon symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D_transformed_to_they +
                ". How many of them will " + _s.variables.Se_transformed_to_they +
                " eventually?"),
              after: "",
              trial_level: "details",
              variable: "bSe",
              variable_type: "!disease->eventually symptom",
              query_type: "numeric"
            },
            {
              before: (
                "Suppose 1000 people " + _s.variables.C_transformed_to_they +
                ". How many will get " + _s.variables.D_transformed_to_they + "? "
              ),
              after: "",
              trial_level: "details",
              variable: "causeCD",
              variable_type: "cause->disease",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D_transformed_to_they +
                " and they " + _s.variables.A_transformed_to_they +
                ". How many will get better? "),
              after: "",
              trial_level: "details",
              variable: "mitigateAD",
              variable_type: "action->disease",
              query_type: "numeric"
            },
            {
              before:  (
                exp.name + " has " + _s.variables.D +
                " and if " + exp.he + " " +
                _s.variables.A +
                " then " + exp.he + " might get better." +
                " How difficult is it for " + exp.him +
                " to do that? "
              ),
              after: "",
              trial_level: "details",
              variable: "costA",
              variable_type: "cost",
              query_type: "qualitative"
            }
        ]);
        _s.trial_level = "details";
        return true;
      } else {
        return true;
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
        comments : $("#comments").val()
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
      var data_log_php_file = "http://ec2-52-53-161-229.us-west-1.compute.amazonaws.com/log_data.php";
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

  // repeatWorker = false;
  // (function(){
  //     var ut_id = "erindb-explanation-20160619";
  //     if (UTWorkerLimitReached(ut_id)) {
  //       $('.slide').empty();
  //       repeatWorker = true;
  //       alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
  //     }
  // })();

  $('input[type="text"]')
    // event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);

  exp.trials = [];
  exp.catch_trials = [];

  exp.instructions = "instructions";

  // var ntrials = stims.length;
  var ntrials = 10;

  exp.numTrials = ntrials;

  exp.system = {
    Browser : BrowserDetect.browser,
    OS : BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };

  exp.structure = [
    "i0",
    "instructions",
    "trial",
    // D is a disease.
    // Bob has D and this causes him to S.
    // Bob has D because he C.
    // Bob has D, so he should A.
    // Bob should A, but he doesn’t A, because he R.
    // 1000 people have D. How many will S?
    // 1000 people C. How many will get D?
    // Bob has D and he A. How much does it help that he A?
    // Bob has D. He should A. How difficult is it for him to do that?
    "subj_info",
    "thanks"
  ];

  var name = _.sample(["Pat", "Sam", "Taylor", "Alex", "Eli"]);
  var gender = _.sample(["men", "women"]);
  exp.gender = gender;
  exp.name = name;
  if (gender == "men") {
    exp.him = "him";
    exp.he = "he";
    exp.his = "his";
  } else if (gender == "women") {
    exp.him = "her";
    exp.he = "she";
    exp.his = "her";
  }

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
