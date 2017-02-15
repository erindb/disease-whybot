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

/*  repeatWorker = false;
  (function(){
      var ut_id = "erindb-explanation-20160619";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();
*/

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
