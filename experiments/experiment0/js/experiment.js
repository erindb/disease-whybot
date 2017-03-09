var parser_callback = function(data, status) {
  if (status=="success") {
    var parse = data;
  } else if (status=="failure") {
    var response_string = data;
  } else {
    console.log("error 98237402q");
  }
};

var get_nlp_data = function(response, callback) {
  var properties = {annotators: "tokenize,ssplit,pos,depparse"};
  var property_string = JSON.stringify(properties);
  var properties_for_url = encodeURIComponent(property_string);
  $.ajax({
    type: "POST",
    url: 'http://' +
      'ec2-54-219-187-44.us-west-1.compute.amazonaws.com/' +
      '?properties=' +
      properties_for_url,
    data: response,
    success: callback(data, "success"),
    error: function (responseData, textStatus, errorThrown) {
      console.log('POST failed.');
      callback(response, "failure");
    }
  });
};

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
  return word.match(/(s)he/i)
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
        // search dependencies for the predicate's subject
        var possible_subject_dependencies = dependencies.filter(
          function(dependency) {
            return ((dependency.governor == predicate) &&
                            (dependency.dep=="nsubj" ||
                              dependency.dep=="nsubjpass"));
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

  for (var v=0; v<verbs_to_replace.length; v++) {
    var verb_to_replace = verbs_to_replace[v];
    var token_index = index(verb_to_replace.index);
    tokens[token_index].new_text = transform_verb(
      verb_to_replace.originalText
    );
  }

  return {
    basicDependencies: dependencies,
    tokens: tokens
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

var transform_to_3rd_plural = function() {
  console.log(parse);
  var sentences = parse.sentences;

  var sentences = sentences.map(replace_verbs);
  var sentences = sentences.map(replace_pronouns);

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

  response = sentences.map(make_sentence_strings).join("");

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
      $("#skip_button").hide();
      $("#wrong").hide();
      $('input[type="text"]').attr('size', 10);
      // $("#wrong").

      if (stim.query_type=="text" || stim.query_type=="numeric") {
        $("#select-response").hide();
        $("#response").show();
      } else if (stim.query_type=="dropdown") {
        $("#response").hide();
        $("#select-response").show();
      }

      if (_s.trial_level == "disease") {
        $(".escape").hide();
      } else {
        $(".escape").show();
      }

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

      this.rt = (Date.now() - this.startTime)/1000;
      var success = this.log_responses();

      /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      if (success) {
        _stream.apply(this);
      	$("#feedback").val("");
      } else {
        $(".err").show();
      }
    },

    log_responses : function(force) {
      var feedback = $("#feedback").val();
      var force = force ? force : false;
      var response;
      if (_s.stim.query_type=="dropdown") {
        response = $("#select-response").val();
      } else if (_s.stim.query_type=="numeric") {
        response = $("#response").val();
        var isValidIntegerRE = /^(1000|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])$/;
        var isValidInteger = isValidIntegerRE.test(response);
        if (!isValidInteger && !force) {
          return false;
        }
        // check that it's a number in the correct range
      } else if (_s.stim.query_type=="text") {
        response = $("#response").val();
      } else {
        response = $("#response").val();
      }
      // TO DO: check that response parses?
      if (response.length > 0 || force) {
        $("#response").val("");
        _s.variables[this.stim.variable] = response.toLowerCase();
        exp.data_trials.push({
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
          feedback: feedback
        });

        if (_s.trial_level == "disease") {
        //   _s.present = [
        //     {
        //       before: (
        //         capitalizeFirstLetter(_s.variables.D) +
        //         " affects "
        //       ),
        //       after: ".",
        //       trial_level: "causes",
        //       variable: "gender",
        //       options: [
        //         "only men",
        //         "only women",
        //         "both men and women"
        //       ],
        //       variable_type: "frequenty symptom",
        //       query_type: "dropdown"
        //     }
        //   ];
        //   _s.trial_level = "gender";
        //   return true;
        // } else if (_s.trial_level == "gender") {
        //   if (exp.gender == "both") {
        //     exp.gender = _.sample(["men", "women"]);
        //   }
        //   if (exp.gender == "men") {
        //     exp.him = "him";
        //     exp.he = "he";
        //     exp.his = "his";
        //   } else if (exp.gender == "women") {
        //     exp.him = "her";
        //     exp.he = "she";
        //     exp.his = "her";
        //   } else {
        //     console.log("error 982374");
        //   }
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
        } else if (_s.trial_level == "causes" && _s.present.length==0)  {
           _s.present = _.shuffle([
            // Bob should A, but he doesn’t A, because he R.
            {
            // It would help if Bob A. If he does not do that, it’s probably because he R.
              before:  (
                exp.name + " has " + _s.variables.D +
                ". It would help if " + exp.he +
                " " + _s.variables.A +
                ". If he does not do that, it's probably because he "
              ),
              after: ".",
              trial_level: "details",
              variable: "R",
              variable_type: "reason",
              query_type: "text"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D +
                ". How many of them will " + _s.variables.Sf +
                " frequently?"),
              after: "",
              trial_level: "details",
              variable: "causeDSf",
              variable_type: "disease->frequent symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D +
                ". How many of them will " + _s.variables.So +
                " occasionally?"),
              after: "",
              trial_level: "details",
              variable: "causeDSo",
              variable_type: "disease->occasional symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D +
                ". How many of them will " + _s.variables.Ss +
                " soon?"),
              after: "",
              trial_level: "details",
              variable: "causeDSs",
              variable_type: "disease->soon symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people have " + _s.variables.D +
                ". How many of them will " + _s.variables.Se +
                " eventually?"),
              after: "",
              trial_level: "details",
              variable: "causeDSe",
              variable_type: "disease->eventually symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D +
                ". How many of them will " + _s.variables.Sf +
                " frequently?"),
              after: "",
              trial_level: "details",
              variable: "bSf",
              variable_type: "!disease->frequent symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D +
                ". How many of them will " + _s.variables.So +
                " occasionally?"),
              after: "",
              trial_level: "details",
              variable: "bSo",
              variable_type: "!disease->occasional symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D +
                ". How many of them will " + _s.variables.Ss +
                " soon?"),
              after: "",
              trial_level: "details",
              variable: "bSs",
              variable_type: "!disease->soon symptom",
              query_type: "numeric"
            },
            {
              before: ("Suppose 1000 people <b>do not</b> have " + _s.variables.D +
                ". How many of them will " + _s.variables.Se +
                " eventually?"),
              after: "",
              trial_level: "details",
              variable: "bSe",
              variable_type: "!disease->eventually symptom",
              query_type: "numeric"
            },
            // 1000 people have D. How many will S?
            // 1000 people C. How many will get D?
            {
              before: (
                "Suppose 1000 people " + _s.variables.C +
                ". How many will get " + _s.variables.D + "? "
              ),
              after: "",
              trial_level: "details",
              variable: "causeCD",
              variable_type: "cause->disease",
              query_type: "numeric"
            },
            // Bob has D and he A. How much does it help that he A?
            // 1000 people have D and they A. How many will get better?
            {
              before: ("Suppose 1000 people have " + _s.variables.D +
                " and they " + _s.variables.A +
                ". How many will get better? "),
              after: "",
              trial_level: "details",
              variable: "mitigateAD",
              variable_type: "action->disease",
              query_type: "numeric"
            },
            // Bob has D. He should A. How difficult is it for him to do that?
            {
              before:  (
                exp.name + " has " + _s.variables.D +
                " and so " + exp.he +
                " should " + _s.variables.A +
                ". How difficult is it for " + exp.him +
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
      } else {
        return false;
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

      exp.data= {
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
