var DEBUG = true;
var debug = function(string) {
  if (DEBUG) {console.log(string)};
};

// put in an example json string to parse
// make the server bigger

var test = function() {
  exp.name = "Bob";
  var example_parse = {"sentences":[{"index":0,"basicDependencies":[{"dep":"ROOT","governor":0,"governorGloss":"ROOT","dependent":2,"dependentGloss":"thinks"},{"dep":"nsubj","governor":2,"governorGloss":"thinks","dependent":1,"dependentGloss":"He"},{"dep":"nsubj","governor":4,"governorGloss":"cure","dependent":3,"dependentGloss":"they"},{"dep":"ccomp","governor":2,"governorGloss":"thinks","dependent":4,"dependentGloss":"cure"},{"dep":"dobj","governor":4,"governorGloss":"cure","dependent":5,"dependentGloss":"colds"},{"dep":"punct","governor":2,"governorGloss":"thinks","dependent":6,"dependentGloss":"."}],"enhancedDependencies":[{"dep":"ROOT","governor":0,"governorGloss":"ROOT","dependent":2,"dependentGloss":"thinks"},{"dep":"nsubj","governor":2,"governorGloss":"thinks","dependent":1,"dependentGloss":"He"},{"dep":"nsubj","governor":4,"governorGloss":"cure","dependent":3,"dependentGloss":"they"},{"dep":"ccomp","governor":2,"governorGloss":"thinks","dependent":4,"dependentGloss":"cure"},{"dep":"dobj","governor":4,"governorGloss":"cure","dependent":5,"dependentGloss":"colds"},{"dep":"punct","governor":2,"governorGloss":"thinks","dependent":6,"dependentGloss":"."}],"enhancedPlusPlusDependencies":[{"dep":"ROOT","governor":0,"governorGloss":"ROOT","dependent":2,"dependentGloss":"thinks"},{"dep":"nsubj","governor":2,"governorGloss":"thinks","dependent":1,"dependentGloss":"He"},{"dep":"nsubj","governor":4,"governorGloss":"cure","dependent":3,"dependentGloss":"they"},{"dep":"ccomp","governor":2,"governorGloss":"thinks","dependent":4,"dependentGloss":"cure"},{"dep":"dobj","governor":4,"governorGloss":"cure","dependent":5,"dependentGloss":"colds"},{"dep":"punct","governor":2,"governorGloss":"thinks","dependent":6,"dependentGloss":"."}],"tokens":[{"index":1,"word":"He","originalText":"He","lemma":"he","characterOffsetBegin":0,"characterOffsetEnd":2,"pos":"PRP","ner":"O","speaker":"PER0","before":"","after":" "},{"index":2,"word":"thinks","originalText":"thinks","lemma":"think","characterOffsetBegin":3,"characterOffsetEnd":9,"pos":"VBZ","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":3,"word":"they","originalText":"they","lemma":"they","characterOffsetBegin":10,"characterOffsetEnd":14,"pos":"PRP","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":4,"word":"cure","originalText":"cure","lemma":"cure","characterOffsetBegin":15,"characterOffsetEnd":19,"pos":"VBP","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":5,"word":"colds","originalText":"colds","lemma":"cold","characterOffsetBegin":20,"characterOffsetEnd":25,"pos":"NNS","ner":"O","speaker":"PER0","before":" ","after":""},{"index":6,"word":".","originalText":".","lemma":".","characterOffsetBegin":25,"characterOffsetEnd":26,"pos":".","ner":"O","speaker":"PER0","before":"","after":" "}]},{"index":1,"basicDependencies":[{"dep":"ROOT","governor":0,"governorGloss":"ROOT","dependent":2,"dependentGloss":"takes"},{"dep":"nsubj","governor":2,"governorGloss":"takes","dependent":1,"dependentGloss":"Bob"},{"dep":"dobj","governor":2,"governorGloss":"takes","dependent":3,"dependentGloss":"vitamins"},{"dep":"mark","governor":6,"governorGloss":"thinks","dependent":4,"dependentGloss":"because"},{"dep":"nsubj","governor":6,"governorGloss":"thinks","dependent":5,"dependentGloss":"he"},{"dep":"advcl","governor":2,"governorGloss":"takes","dependent":6,"dependentGloss":"thinks"},{"dep":"nsubj","governor":8,"governorGloss":"cure","dependent":7,"dependentGloss":"they"},{"dep":"ccomp","governor":6,"governorGloss":"thinks","dependent":8,"dependentGloss":"cure"},{"dep":"dobj","governor":8,"governorGloss":"cure","dependent":9,"dependentGloss":"colds"},{"dep":"punct","governor":2,"governorGloss":"takes","dependent":10,"dependentGloss":"."}],"enhancedDependencies":[{"dep":"ROOT","governor":0,"governorGloss":"ROOT","dependent":2,"dependentGloss":"takes"},{"dep":"nsubj","governor":2,"governorGloss":"takes","dependent":1,"dependentGloss":"Bob"},{"dep":"dobj","governor":2,"governorGloss":"takes","dependent":3,"dependentGloss":"vitamins"},{"dep":"mark","governor":6,"governorGloss":"thinks","dependent":4,"dependentGloss":"because"},{"dep":"nsubj","governor":6,"governorGloss":"thinks","dependent":5,"dependentGloss":"he"},{"dep":"advcl:because","governor":2,"governorGloss":"takes","dependent":6,"dependentGloss":"thinks"},{"dep":"nsubj","governor":8,"governorGloss":"cure","dependent":7,"dependentGloss":"they"},{"dep":"ccomp","governor":6,"governorGloss":"thinks","dependent":8,"dependentGloss":"cure"},{"dep":"dobj","governor":8,"governorGloss":"cure","dependent":9,"dependentGloss":"colds"},{"dep":"punct","governor":2,"governorGloss":"takes","dependent":10,"dependentGloss":"."}],"enhancedPlusPlusDependencies":[{"dep":"ROOT","governor":0,"governorGloss":"ROOT","dependent":2,"dependentGloss":"takes"},{"dep":"nsubj","governor":2,"governorGloss":"takes","dependent":1,"dependentGloss":"Bob"},{"dep":"dobj","governor":2,"governorGloss":"takes","dependent":3,"dependentGloss":"vitamins"},{"dep":"mark","governor":6,"governorGloss":"thinks","dependent":4,"dependentGloss":"because"},{"dep":"nsubj","governor":6,"governorGloss":"thinks","dependent":5,"dependentGloss":"he"},{"dep":"advcl:because","governor":2,"governorGloss":"takes","dependent":6,"dependentGloss":"thinks"},{"dep":"nsubj","governor":8,"governorGloss":"cure","dependent":7,"dependentGloss":"they"},{"dep":"ccomp","governor":6,"governorGloss":"thinks","dependent":8,"dependentGloss":"cure"},{"dep":"dobj","governor":8,"governorGloss":"cure","dependent":9,"dependentGloss":"colds"},{"dep":"punct","governor":2,"governorGloss":"takes","dependent":10,"dependentGloss":"."}],"tokens":[{"index":1,"word":"Bob","originalText":"Bob","lemma":"Bob","characterOffsetBegin":27,"characterOffsetEnd":30,"pos":"NNP","ner":"PERSON","speaker":"PER0","before":" ","after":" "},{"index":2,"word":"takes","originalText":"takes","lemma":"take","characterOffsetBegin":31,"characterOffsetEnd":36,"pos":"VBZ","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":3,"word":"vitamins","originalText":"vitamins","lemma":"vitamin","characterOffsetBegin":37,"characterOffsetEnd":45,"pos":"NNS","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":4,"word":"because","originalText":"because","lemma":"because","characterOffsetBegin":46,"characterOffsetEnd":53,"pos":"IN","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":5,"word":"he","originalText":"he","lemma":"he","characterOffsetBegin":54,"characterOffsetEnd":56,"pos":"PRP","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":6,"word":"thinks","originalText":"thinks","lemma":"think","characterOffsetBegin":57,"characterOffsetEnd":63,"pos":"VBZ","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":7,"word":"they","originalText":"they","lemma":"they","characterOffsetBegin":64,"characterOffsetEnd":68,"pos":"PRP","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":8,"word":"cure","originalText":"cure","lemma":"cure","characterOffsetBegin":69,"characterOffsetEnd":73,"pos":"VBP","ner":"O","speaker":"PER0","before":" ","after":" "},{"index":9,"word":"colds","originalText":"colds","lemma":"cold","characterOffsetBegin":74,"characterOffsetEnd":79,"pos":"NNS","ner":"O","speaker":"PER0","before":" ","after":""},{"index":10,"word":".","originalText":".","lemma":".","characterOffsetBegin":79,"characterOffsetEnd":80,"pos":".","ner":"O","speaker":"PER0","before":"","after":""}]}],"corefs":{"5":[{"id":0,"text":"He","type":"PRONOMINAL","number":"SINGULAR","gender":"MALE","animacy":"ANIMATE","startIndex":1,"endIndex":2,"headIndex":1,"sentNum":1,"position":[1,1],"isRepresentativeMention":true},{"id":5,"text":"he","type":"PRONOMINAL","number":"SINGULAR","gender":"MALE","animacy":"ANIMATE","startIndex":5,"endIndex":6,"headIndex":5,"sentNum":2,"position":[2,3],"isRepresentativeMention":false}],"6":[{"id":1,"text":"they","type":"PRONOMINAL","number":"PLURAL","gender":"UNKNOWN","animacy":"ANIMATE","startIndex":3,"endIndex":4,"headIndex":3,"sentNum":1,"position":[1,2],"isRepresentativeMention":true},{"id":6,"text":"they","type":"PRONOMINAL","number":"PLURAL","gender":"UNKNOWN","animacy":"ANIMATE","startIndex":7,"endIndex":8,"headIndex":7,"sentNum":2,"position":[2,4],"isRepresentativeMention":false}]}};
  var response = "he thinks they cure colds";
  console.log(response);
  var negated_response = negate(response, example_parse, "Bob takes vitamins because ");
  console.log(negated_response);
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
  exp.variables.name = names.pop();
  var g = _.sample(["men", "women"]);
  exp.variables.gender = g;
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

// var has_they_subject = function(dependencies, token, tokens) {
//   // here's an even harder version. sometimes we have to
//   // deal with conjunctions.

//   // some verbs are aux or cop and their connection
//   // to their subject is via some root predicate
//   var main_predicate = find_main_predicate(dependencies, token, tokens);
//   var subject_dependency = find_subject_dependency(
//     dependencies,
//     main_predicate,
//     tokens
//   );
//   if (subject_dependency) {
//     var subject_index = index(subject_dependency.dependent);
//     return isTheyPron(tokens[subject_index].word);
//   }
//   return false;
// };

// var replace_verbs = function(sentence) {
//   var dependencies = sentence["basicDependencies"];
//   var tokens = sentence.tokens;

//   // filter to only verbs
//   var all_verbs = tokens.filter(function(token) {
//     return token.pos[0]=="V"
//   });

//   var verbs_to_replace = [];

//   // extract verbs with (s)he as subject
//   for (var v=0; v<all_verbs.length; v++) {
//     var token = all_verbs[v];
//     // find the subject of each verb by looking in the dependency parse
//     if (has_they_subject(dependencies, token, tokens)) {
//       verbs_to_replace.push(token);
//     };
//   }

//   var new_tokens = tokens;
//   for (var v=0; v<verbs_to_replace.length; v++) {
//     var verb_to_replace = verbs_to_replace[v];
//     var token_index = index(verb_to_replace.index);
//     new_tokens[token_index].new_text = transform_verb(
//       verb_to_replace.originalText
//     );
//   }

//   return {
//     basicDependencies: dependencies,
//     tokens: new_tokens
//   }
// };

// ------------ PRONOUNS ------------
var easy_pronouns = {
  she: "<span class='variable_word he'>{{}}</span>",
  he: "<span class='variable_word he'>{{}}</span>",
  him: "<span class='variable_word him'>{{}}</span>",
  his: "<span class='variable_word his'>{{}}</span>"
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
  var before_index = before_text.trim().split(" ").length - 1;
  var tokens = sentence.tokens;
  var dependencies = sentence["basicDependencies"];
  var named = false;
  var new_tokens = [];
  for (var i=0; i<tokens.length; i++) {
    var token = tokens[i];
    var text = token.originalText.toLowerCase();
    if (Object.keys(easy_pronouns).indexOf(text)>=0 && index(token.index)>= before_index) {
      if (named) {
        token.new_text = easy_pronouns[text];
      } else {
        if (text == "his") {
          token.new_text = "<span class='variable_word name'>{{}}</span>'s"
        } else {
          token.new_text = "<span class='variable_word name'>{{}}</span>"
        }
        named = true
      }
    } else if (text == "her" && index(token.index)>= before_index) {
      var pos = token.pos;
      if (pos == "PRP$") {
        if (named) {
          token.new_text = "<span class='variable_word his'>{{}}</span>";
        } else {
          token.new_text = "<span class='variable_word name'>{{}}</span>'s"
          named = true
        }
      } else if (pos=="PRP") {
        if (named) {
          token.new_text = "<span class='variable_word him'>{{}}</span>";
        } else {
          token.new_text = "<span class='variable_word name'>{{}}</span>";
          named = true
        }
      } else {
        console.log("warning 239847");
      }
    }
    new_tokens.push(token)
  }
  // var tokens = tokens.map(function(token) {
  //   var text = token.word.toLowerCase();
  //   if (Object.keys(easy_pronouns).indexOf(text)>=0 && index(token.index)>= before_index) {
  //     token.new_text = easy_pronouns[text];
  //     return token;
  //   }
  //   if (text == "her" && index(token.index)>= before_index) {
  //     var pos = token.pos;
  //     if (pos == "PRP$") {
  //       token.new_text = "<span class='variable_word his'>{{}}</span>";
  //       return token;
  //     } else if (pos=="PRP") {
  //       token.new_text = "<span class='variable_word him'>{{}}</span>";
  //       return token;
  //     } else {
  //       console.log("warning 239847");
  //     }
  //   }
  //   return token;
  // });
  return {tokens: new_tokens, basicDependencies: dependencies};
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
  // console.log(full_sentence);
  get_nlp_data(
    response,
    //full_sentence,
    response.charAt(0).toUpperCase() + response.slice(1),
    //response.charAt(0).toUpperCase() + response.slice(1) + ". " + full_sentence,
    function(response, status, parse) {
      // console.log(response);
      // console.log(parse);
      if (status=="success") {
        console.log("post succeeded");
        // var transformed_response = transform_to_3rd_plural(parse, response, datum.before_text);
        // datum.transformed_response = transformed_response;
        var negation_data = negate(response, parse, datum.before_text);
        datum.negated_response = negation_data.negation.trim();
        datum.positive_response = negation_data.positive.trim();
        datum.parse_error = false;
      } else if (status=="failure") {
        console.log("post failed");
        // datum.transformed_response = response;
        var negation_data = negate(response);
        datum.negated_response = negation_data.negation.trim();
        datum.positive_response = negation_data.positive.trim();
        // datum.negated_response = negate(response);
        datum.parse_error = true;
      } else {
        console.log("error -21938409238r");
      }
      // exp.variables[datum.variable + "_transformed_to_they"] = datum.transformed_response;
      exp.variables["negated_" + datum.variable] = datum.negated_response;
      exp.variables["positive_" + datum.variable] = datum.positive_response;
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

var negate_main_verb = function(sentence) {
  var dependencies = sentence["basicDependencies"];
  var tokens = sentence.tokens;

  // use ROOT to find the head of the sentence
  var main_verb_index = index(dependencies[0]["dependent"]);

  // find all dependents of the main verb
  var main_verb_dependents = get_dependents(main_verb_index, dependencies);

  var negated_sentence = JSON.parse(JSON.stringify(sentence))
  var positive_sentence = JSON.parse(JSON.stringify(sentence))

  // if there's negation OFF OF THAT VERB,
  // keep it to get the "positive" version and
  // drop it to get the "negated" version
  var already_has_negation = false;
  for (var i=0; i<main_verb_dependents.length; i++) {
    var dependency = main_verb_dependents[i];
    if (dependency.dep == "neg") {
      var negation_index = index(dependency.dependent);
      negated_sentence.tokens[negation_index].new_text = "";
      already_has_negation = true
    }
  }
  if (already_has_negation) {
    return {
      negation: make_sentence_strings(negated_sentence) + " ",
      positive: make_sentence_strings(positive_sentence) + " "
    }
  } else {

    // otherwise...

    // if there's a quantifier OFF THAT VERB,
    // drop it and just make two version of the sentence
    var quantifiers = [
      "always", "never", "usually", "sometimes", "often",
      "constantly", "frequently"
    ];
    // if any of the main verb dependents have a dependentGloss from the quantifiers above, drop it from tokens
    for (var i=0; i<main_verb_dependents.length; i++) {
      var dependency = main_verb_dependents[i];
      if (quantifiers.includes(dependency.dependentGloss)) {
        var quantifier_index = index(dependency.dependent);
        negated_sentence.tokens[quantifier_index].new_text = "";
        positive_sentence.tokens[quantifier_index].new_text = "";
      }
    }

    // if there's a helper or modal verb OFF THE MAIN VERB, negate it
    var helper_verbs = {
      "does": "doesn't",
      "did": "didn't",
      "is": "isn't",
      "was": "wasn't",
      "has": "hasn't",
      "can": "cannot",
      "should": "shouldn't",
      "would": "wouldn't",
      "might": "might not",
      "must": "doesn't have to",
      "will": "won't",
      "could": "couldn't",
      "may": "can't",
      "'s": " isn't"
    };
    var helper_verbs_list = Object.keys(helper_verbs);
    var has_helper_verb = false;
    for (var i=0; i<main_verb_dependents.length; i++) {
      var dependency = main_verb_dependents[i];
      if (helper_verbs_list.includes(dependency.dependentGloss)) {
        var helper_verb_index = index(dependency.dependent);
        negated_sentence.tokens[helper_verb_index].new_text = helper_verbs[dependency.dependentGloss];
        has_helper_verb = true;
      }
    }

    if (has_helper_verb) {
      return {
        negation: make_sentence_strings(negated_sentence) + " ",
        positive: make_sentence_strings(positive_sentence) + " "
      }
    } else {
      // otherwise, change the verb to "did not [LEMMA]"
      var main_verb_lemma = sentence.tokens[main_verb_index].lemma;
      negated_sentence.tokens[main_verb_index].new_text = "did not " + main_verb_lemma;

      return {
        negation: make_sentence_strings(negated_sentence) + " ",
        positive: make_sentence_strings(positive_sentence) + " "
      }
    }

  }
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
    variable: "pC",
    before: (
      span("name") + " has " + span("D") + " because "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 1,
    variable: "nC",
    before: (
      span("name") + " does not have " + span("D") + " because "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
   {
    query_type: "text",
    trial_level: 1,
    variable: "pR",
    before: (
      "Because " + span("name") + " has " + span("D") + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 1,
    variable: "nR",
    before: (
      "Because " + span("name") + " does not have " + span("D") + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
];

var level2 = [
  // pC nodes
  {
    query_type: "text",
    trial_level: 2,
    variable: "pCpC",
    before: (
      //span("name") + " " + 
      "<span class='history'>" +
      span("name") + " has " + span("D") + ".<br/>" + 
      span("positive_pC").trim() + ".<br/>" +
      "</span>" +
      span("positive_pC").trim() + " because "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 2,
    variable: "pCnC",
    before: (
      //span("name") + " " + 
      "<span class='history'>" +
      span("name") + " does not have " + span("D") + ".<br/>" +
      span("negated_pC").trim() + ".<br/>" +
      "</span>" + 
      span("negated_pC").trim() + " because " // placeholder 
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  }, 
  {
    query_type: "text",
    trial_level: 2,
    variable: "pCnR",
    before: (
      "<span class='history'>" +
      // span("name") + " does not have " + span("D") + ".<br/>" +
      span("negated_pC").trim() + ".<br/>" +
      "</span>" +
      "Because " + //span("name") + " " + 
      span("negated_pC").trim() + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  }, // nC nodes
  {
    query_type: "text",
    trial_level: 2,
    variable: "nCpC",
    before: (
      //span("name") + " " + 
      "<span class='history'>" +
      span("name") + " does not have " + span("D") + ".<br/>" + 
      span("positive_nC").trim() + ".<br/>" +
      "</span>" +
      span("positive_nC").trim() + " because "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 2,
    variable: "nCnC",
    before: (
      // span("name") + " " +  
      "<span class='history'>" +
      span("name") + " has " + span("D") + ".<br/>" + 
      span("negated_nC").trim() + ".<br/>" +
      "</span>" +
      span("negated_nC").trim() + " because " 
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 2,
    variable: "nCpR",
    before: (
      "<span class='history'>" +
      // span("name") + " does not have " + span("D") + ".<br/>" + 
      span("positive_nC").trim() + ".<br/>" +
      "</span>" +
      "Because " + //span("name") + " " + 
      span("positive_nC").trim() + ", " 
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  // pR nodes
  {
    query_type: "text",
    trial_level: 2,
    variable: "pRnC",
    before: (
      //span("name") + " " +  
      "<span class='history'>" +
      // span("name") + " does not have " + span("D") + ".<br/>" + 
      span("negated_pR").trim() + ".<br/>" +
      "</span>" +
      span("negated_pR").trim() + " because "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 2,
    variable: "pRpR",
    before: (
      "<span class='history'>" +
      span("name") + " has " + span("D") + ".<br/>" + 
      span("positive_pR").trim() + ".<br/>" +
      "</span>" +
      "Because " + //span("name") + " " +  
      span("positive_pR").trim() + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  }, 
  {
    query_type: "text",
    trial_level: 2,
    variable: "pRnR",
    before: (
      "<span class='history'>" +
      span("name") + " does not have " + span("D") + ".<br/>" + 
      span("negated_pR").trim() + ".<br/>" +
      "</span>" +
      "Because " + //span("name") + " " +  
      span("negated_pR").trim() + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  }, // nR nodes
  {
    query_type: "text",
    trial_level: 2,
    variable: "nRpC",
    before: (
      //span("name") + " " + 
      "<span class='history'>" +
      // span("name") + " does not have " + span("D") + ".<br/>" + 
      span("positive_nR").trim() + ".<br/>" +
      "</span>" +
      span("positive_nR").trim() + " because "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
  {
    query_type: "text",
    trial_level: 2,
    variable: "nRpR",
    before: (
      "<span class='history'>" +
      span("name") + " does not have " + span("D") + ".<br/>" + 
      span("positive_nR").trim() + ".<br/>" +
      "</span>" +
      "Because " + //span("name") + " " + 
      span("positive_nR").trim() + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  }, 
  {
    query_type: "text",
    trial_level: 2,
    variable: "nRnR",
    before: (
      "<span class='history'>" +
      // span("name") + " has " + span("D") + ".<br/>" + 
      span("negated_nR").trim() + ".<br/>" +
      "</span>" +
      "Because " + //span("name") + " " + 
      span("negated_nR").trim() + ", "
    ),
    after: ".",
    n_symptoms: "NA",
    prompt: "NA",
    in_between: "NA"
  },
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
      $("#total-time").html(6);
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

      sample_protagonist();

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
            // console.log(response);
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

        // then do it again, because some vars have other vars inside
        _.forEach(["name", "HHe", "HHim", "HHis", "he", "his", "him"], function(variable) {
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

      _s.rt = (Date.now() - _s.startTime)/1000;

      var is_valid = true;
      var trial_data = [];
      _.forEach(_.keys(_s.response_handlers), function(variable) {
        var datum = _s.response_handlers[variable]();
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
  test();

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

  exp.disease = _.sample([
    "a cold",
    "cancer",
    "depression",
    "diabetes"
  ]);

  exp.structure = [
    "i0",
    "instructions",
    "trial",
    "subj_info",
    "thanks"
  ];

  exp.variables = {};
  exp.variables2 = {};

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
