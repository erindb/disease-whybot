var DEBUG = false;
var debug = function(string) {
  if (DEBUG) {console.log(string)};
};

var experiment_label = "paraphrase_whybot_0";
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
  var properties = {annotators: "tokenize,ssplit,pos,depparse,lemma"};
  var property_string = JSON.stringify(properties);
  var properties_for_url = encodeURIComponent(property_string);
  $("#processing").show();
  $.ajax({
    type: "POST",
    url: 'https://' +
      'rxdhawkins.me:8882/' +
      '?properties=' +
      properties_for_url,
    data: full_sentence,
    success: function(data) {
      $("#processing").hide();
      // console.log(JSON.parse(data));
      callback(response, "success", JSON.parse(data));
    },
    error: function (responseData, textStatus, errorThrown) {
      $("#processing").hide();
      console.log('POST failed.');
      callback(response, "failure");
    },
    timeout: 5000
  });
};

var valid_numeric_response = function(response) {
  var isValidIntegerRE = /^(1000|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var isValidInteger = isValidIntegerRE.test(response);
  return isValidInteger;
};

var collect_response = function() {};

var names = _.shuffle([
  "Pat", "Sam", "Taylor", "Alex", "Eli",
  "Jordan", "Drew", "Ash", "Chris", "Jess",
  "Jo", "Nat", "Robin", "Sal", "Casey",
  "Avery", "Jamie", "Madison", "Tracy",
  // "Indigo", "Jackson", "Peyton", "Jayden"
]);
var pronouns = {
  "men": {
    "nominative": "he",
    "accusative": "him",
    "genitive": "his"
  },
  "women": {
    "nominative": "she",
    "accusative": "her",
    "genitive": "her"
  }
};
var sample_protagonist = function() {
  // var g = _.sample(["men", "women"]);
  // exp.variables.name = g=="men" ? "the man" : "the woman";
  // exp.variables.gender = g;
  var g = "men";
  exp.variables.he = pronouns[g]["nominative"];
  exp.variables.him = pronouns[g]["accusative"];
  exp.variables.his = pronouns[g]["genitive"];
  exp.variables.HHe = capitalizeFirstLetter(exp.variables.he);
  exp.variables.HHim = capitalizeFirstLetter(exp.variables.him);
  exp.variables.HHis = capitalizeFirstLetter(exp.variables.his);
};

var index = function(s) {
  return parseInt(s)-1;
};

var stim = function(seed, i, source, target, query_type) {
  var stim_info = {
    seed: seed,
    query_type: "text",
    trial_level: 0,
    variable: target + i
  };
  if (query_type=="cause") {
    stim_info["before"] = span(source+i) + " because ";
    stim_info["after"] = ".";

  } else if (query_type=="result") {
    stim_info["before"] = "Because " + span(source+i+"_lower") + ", ";
    stim_info["after"] = ".";
  } else {
    console.log("error 12948572-3");
  }
  return stim_info;
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

// ------------ PRONOUNS ------------
var easy_pronouns = {
  she: "<span class='variable_word he'>{{}}</span>",
  he: "<span class='variable_word he'>{{}}</span>",
  him: "<span class='variable_word him'>{{}}</span>",
  his: "<span class='variable_word his'>{{}}</span>",
  hes: "the man's"
};

var make_sentence_strings = function(sentence) {
  var tokens = sentence.tokens;

  var new_words = tokens.map(function(token) {
    if (token.new_text == null) {
      return token.before + token.originalText;
    } else {
      return token.before + token.new_text;
    }
  });

  return new_words.join("");
};

var replace_pronouns = function(sentence, before_text) {
  var tokens = sentence.replace(/ *([.,!"']) */g, "").split(" ");
  var new_tokens = [];
  var named = false;
  for (var i=0; i<tokens.length; i++) {
    var token = tokens[i];
    var text = token.toLowerCase();
    var new_text = text
    if (Object.keys(easy_pronouns).indexOf(text)>=0) {
      new_text = easy_pronouns[text];
      named = true
    } else if (text == "her") {
      // var pos = token.pos;
      // if (pos == "PRP") {
      if (i==tokens.length-1) {
      // } else if (pos=="PRP$") {
        if (named) {
          new_text = "<span class='variable_word him'>{{}}</span>";
        } else {
          new_text = "the man";
          named = true
        }
      } else {
        if (named) {
          new_text = "<span class='variable_word his'>{{}}</span>";
        } else {
          new_text = "the man's"
          named = true
        }
      }
    }
    new_tokens.push(new_text)
  }
  return new_tokens.join(" ");
  // return {tokens: new_tokens, basicDependencies: dependencies};
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function open_feedback() {
  $("#wrong").show();
}

function maybe_allow_skip() {
  if ($("#feedback").val() == "impossible" || $("#feedback").val() == "weird") {
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
  var response = replace_pronouns(datum.response);
  var full_sentence = datum.before_text + response + datum.after_text;
  var capitalized_response = response.charAt(0).toUpperCase()+response.slice(1);
  var lowercased_response = response.charAt(0).toLowerCase()+response.slice(1);
  exp.variables[datum.variable] = capitalized_response;
  exp.variables[datum.variable+"_lower"] = lowercased_response;
  if (datum_index==(trial_data.length-1)) {
    final_callback(true, trial_data);
  } else {
    parse_and_continue(
      datum_index+1,
      trial_data,
      final_callback
    );
  }
};

var break_index = function(i) {
  return "" + (i+1);
};

var get_dependents = function(i, dependencies) {
  var dependents = [];
  for (var d = 0; d<dependencies.length; d++) {
    var dependency = dependencies[d];
    if (dependency.governor==break_index(i)) {
      dependents.push(dependency);
    }
  }
  return dependents;
};

var resolve_corefs = function(parse) {
  var corefs = parse.corefs;
  for (coref_id in corefs) {
    // if the mentions include the protagonist, don't replace anything here
    var includes_protagonist = false;
    //console.log(exp.name);
    var mentions = corefs[coref_id]
    for (var i=0; i<mentions.length; i++) {
      var mention = mentions[i];
    }
  }
  return parse;
};

var seed_dict = {
  "seeds0" : _.shuffle([
    "A man is lifting weights",
    "The man is eating",
    "The lady put dried noodles in the hot water to cook",
    "A man is playing a violin",
    "A woman is swimming",
    "The man is buttering bread",
  ]),
  "seeds1": _.shuffle([
  "A man is lifting a barbell",
  "A man is eating food",
  "A woman places a container of noodles in a pan of water",
  "A man is playing a harp",
  "A man is spitting",
  "The man is stirring the rice"
  ])
};

var seeds_type = _.sample(["seeds0", "seeds1"]);
var seeds = seed_dict[seeds_type];

var negate = function(originalText, parse, before_text) {
  var revisedText = originalText;

  if (parse==null) {
    return {negation: "NOT(" + revisedText + ")", positive: revisedText};
  } else {

    var corefs_resolved_parse = resolve_corefs(parse);

    var sentences = corefs_resolved_parse.sentences;
    // abstract out pronouns
    // var pronouns_replaced = _.map(sentences, function(s) {return replace_pronouns(s, before_text)});
    var pronouns_replaced = _.map(sentences, function(s) {return replace_pronouns(s, "")});
    // negate verb
    // Drop any additional sentences people give - TODO
    var negated_sentences_data = negate_main_verb(pronouns_replaced[0]);

    // var full_sentence = negated_sentences.map(make_sentence_strings).join("");
    // console.log(full_sentence)

    // var n_words_total = full_sentence.split(" ").length;

    // before = before_text.replace(/ $/, "");
    // var n_words_before = before.split(" ").length;

    // // var n_words_response = n_words_total - n_words_before;

    // var all_words = full_sentence.split(" ");

    // var response_words = all_words.slice(n_words_before, n_words_total);
    // response = response_words.join(" ");
    // response = response.replace(/[.,]$/, "");

    return negated_sentences_data;
  }
};

function get_exp_length() {
  // console.log("get exp length not implemented");
  return (
    1 + //instructions
    1 + //checkbox
    exp.level0.length + //disease
    exp.level1.length + //level 1
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
      $("#total-time").html(6);
     }
  });

  slides.instructions = slide({
    name : "instructions",
    start : function() {
      $(".err").hide();
      $(".because_of_error").hide();
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

    present : _.shuffle(exp.level0).concat(
      _.shuffle(exp.level1)
    ),

    present_handle : function(stim) {

      this.startTime = Date.now();
      this.stim = stim;

      $(".err").hide();
      $(".because_of_error").hide();
      $("#processing").hide();
      $("#skip_button").hide();
      $("#wrong").hide();

      sample_protagonist();

      var query_type = stim.query_type;

      var setup_query;
      var setup_response_handlers;
      var setup_interface;
      $(".prompt").html("Fill in the blank.");

      var response_element;
      response_element = $(
        "<input>",
        {
          id: "response",
          type: "text"
        }
      ).attr('size',10);
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

      $("#response").focus();
      $('input[type="text"]')
        // event handler
        .keyup(resizeInput)
        // resize on page load
        .each(resizeInput);

      // for each variable, map it to its class
      _.forEach(_.keys(exp.variables), function(variable) {
        $("." + variable).html(exp.variables[variable]);
      });
      _.forEach(
        ["he", "his", "him", "HHe", "HHis", "HHim", "name", "NName"],
        function(variable) {
          $("." + variable).html(exp.variables[variable]);
        }
      );

    },

    response_handler: function() {
      response = $("#response").val();
      feedback = $("#feedback").val();
      // console.log(response);
      exp.variables[_s.stim.variable] = response;
      var is_valid = response.length > 0;
      return {
        response: response,
        is_valid: is_valid,
        parser_feedback: feedback,
        secondary_response: "NA",
        secondary_response_type: "NA"
      };
    },

    final_callback: function(success, trial_data) {
      $("#feedback").val("");
      /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      if (success) {
        exp.data_trials = exp.data_trials.concat(trial_data);

        // trial_data.forEach(function(datum) {
        //   var data_log_php_file = "https://rxdhawkins.me/~erindb/log_data.php";
        //   $.get(
        //     data_log_php_file + 
        //     "?input=" + 
        //     encodeURIComponent(
        //       JSON.stringify(datum)
        //     ) +
        //     "&experiment=" + experiment_label +
        //     "&userid=" + userid
        //   );
        // })

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

      if ($("#response").val().slice(0,3).toLowerCase()=="of ") {
        $(".because_of_error").show()
      } else {

        _s.rt = (Date.now() - _s.startTime)/1000;

        var is_valid = true;
        var trial_data = [];

        var datum = _s.response_handler();

        // console.log(datum);
        if (datum.is_valid==false) {is_valid=false};
        datum = _.extend(_.clone(_s.stim), datum);
        datum = _.extend(_.clone(datum), {
          // transformed_response: "NA",
          negated_response: "NA",
          parse_error: "NA",
          time: Date.now(),
          rt: _s.rt,
          userid: userid,
          start: exp.startT,
          before_text: $("#before_" + _s.stim.variable).text(),
          after_text: $("#after_" + _s.stim.variable).text()
        });
        // stim variable is less specific
        // than this response-handler variable.
        datum.variable = _s.stim.variable;
        trial_data.push(datum);

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
        // gender : $("#gender").val(),
        education : $("#education").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val(),
        comments : $("#comments").val(),
        how_did_it_go: $("#how_did_it_go").val(),
        experiment_name: exp.name,
        // experiment_gender: exp.gender,
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
      // var data_log_php_file = "https://rxdhawkins.me/erindb/log_data.php";
      // $.get(
      //   data_log_php_file + 
      //   "?input=" + 
      //   encodeURIComponent(
      //     JSON.stringify(subject_data_to_log)
      //   ) +
      //   "&experiment=" + experiment_label +
      //   "&userid=" + userid + "_subject"
      // );

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
  //test();

  repeatWorker = false;
  // (function(){
  //     var ut_id = "erindb-whybot-20170413";
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

  exp.structure = [
    "i0",
    "instructions",
    "trial",
    "subj_info",
    "thanks"
  ];

  exp.variables = {};
  exp.variables2 = {};

  var level0 = []
  var level1 = []
  for (i=0; i<seeds.length; i++) {
    var seed = seeds[i];
    exp.variables["seed" + i] = seed;
    var lowercased_seed = seed.charAt(0).toLowerCase()+seed.slice(1);
    exp.variables["seed" + i + "_lower"] = lowercased_seed;
    level0.push(stim(seed, i, "seed", "C", "cause"))
    level0.push(stim(seed, i, "seed", "R", "result"))
    level1.push(stim(seed, i, "C", "CC", "cause"))
    level1.push(stim(seed, i, "C", "CR", "result"))
    level1.push(stim(seed, i, "R", "RC", "cause"))
    level1.push(stim(seed, i, "R", "RR", "result"))
  };

  exp.level0 = level0;
  exp.level1 = level1;

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
