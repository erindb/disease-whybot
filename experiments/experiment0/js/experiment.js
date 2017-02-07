function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_exp_length() {
  console.log("get exp length not implemented");
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
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name: "trial",

    present :  [
      {
        before: "",
        after: " is a disease.",
        variable: "D",
        variable_type: "disease",
        trial_level: "disease",
        query_type: "text"
      }
    ],

    variables: {},

    trial_level : "disease",

    present_handle : function(stim) {

      this.startTime = Date.now();
      this.stim = stim;

      $(".err").hide();

      $("#before").html(stim.before);
      $("#after").html(stim.after);
    },

    button : function() {

      this.rt = (Date.now() - this.startTime)/1000;
      var success = this.log_responses();

      /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      if (success) {
        _stream.apply(this);
      } else {
        $(".err").show();
      }

    },

    log_responses : function() {
      var response = $("#response").val();
      // TO DO: check that response parses?
      if (response.length > 0) {
        $("#response").val("");
        _s.variables[this.stim.variable] = response;
        exp.data_trials.push({
          response: response,
          variable: this.stim.variable,
          variable_type: this.stim.variable_type,
          before: this.stim.before,
          after: this.stim.after,
          trial: this.stim.trial_level
        });

        if (_s.trial_level == "disease") {
          // Bob has D and this causes him to S.
          // Bob has D because he C.
          // Bob has D, so he should A.
          _s.present = _.shuffle([
            {
              before: "Bob has " + _s.variables.D + " and this causes him to ",
              after: ".",
              trial_level: "causes",
              variable: "S",
              variable_type: "symptom",
              query_type: "text"
            },
            {
              before: "Bob has " + _s.variables.D + " because he ",
              after: ".",
              trial_level: "causes",
              variable: "C",
              variable_type: "cause",
              query_type: "text"
            },
            {
              before: "Bob has " + _s.variables.D + " and so he should ",
              after: ".",
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
              before: (
                "Bob has " + _s.variables.D +
                ", so he should " + _s.variables.A +
                ". But he doesn't " + _s.variables.A + 
                ", because he "),
              after: ".",
              trial_level: "details",
              variable: "R",
              variable_type: "reason",
              query_type: "text"
            },
            // 1000 people have D. How many will S?
            {
              before: (
                "1000 people have " + _s.variables.D +
                ". How many will " + _s.variables.S + "? "
              ),
              after: "",
              trial_level: "details",
              variable: "causeDS",
              variable_type: "disease->symptom",
              query_type: "numeric"
            },
            // 1000 people C. How many will get D?
            {
              before: (
                "1000 people " + _s.variables.C +
                ". How many will get " + _s.variables.D + "? "
              ),
              after: "",
              trial_level: "details",
              variable: "causeCD",
              variable_type: "cause->disease",
              query_type: "numeric"
            },
            // Bob has D and he A. How much does it help that he A?
            {
              before: ("Bob has " + _s.variables.D +
                " and he " + _s.variables.A +
                ". How much does it help that he " +
                _s.variables.A + "? "),
              after: "",
              trial_level: "details",
              variable: "mitigateAD",
              variable_type: "action->disease",
              query_type: "qualitative"
            },
            // Bob has D. He should A. How difficult is it for him to do that?
            {
              before: (
                "Bob has " + _s.variables.D +
                " and so he should " + _s.variables.A +
                ". How difficult is it for him to do that? "
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
