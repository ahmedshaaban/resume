var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal =
  Terminal ||
  function(cmdLineContainer, outputContainer) {
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem =
      window.requestFileSystem || window.webkitRequestFileSystem;

    var cmdLine_ = document.querySelector(cmdLineContainer);
    var output_ = document.querySelector(outputContainer);

    const CMDS_ = ["clear", "clock", "date", "echo", "help", "uname", "whoami", "projects"];

    var fs_ = null;
    var cwd_ = null;
    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

    window.addEventListener(
      "click",
      function(e) {
        cmdLine_.focus();
      },
      false
    );

    cmdLine_.addEventListener("click", inputTextClick_, false);
    cmdLine_.addEventListener("keydown", historyHandler_, false);
    cmdLine_.addEventListener("keydown", processNewCommand_, false);

    //
    function inputTextClick_(e) {
      this.value = this.value;
    }

    //
    function historyHandler_(e) {
      if (history_.length) {
        if (e.keyCode == 38 || e.keyCode == 40) {
          if (history_[histpos_]) {
            history_[histpos_] = this.value;
          } else {
            histtemp_ = this.value;
          }
        }

        if (e.keyCode == 38) {
          // up
          histpos_--;
          if (histpos_ < 0) {
            histpos_ = 0;
          }
        } else if (e.keyCode == 40) {
          // down
          histpos_++;
          if (histpos_ > history_.length) {
            histpos_ = history_.length;
          }
        }

        if (e.keyCode == 38 || e.keyCode == 40) {
          this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
          this.value = this.value; // Sets cursor to end of input.
        }
      }
    }

    //
    function processNewCommand_(e) {
      if (e.keyCode == 9) {
        // tab
        e.preventDefault();
        // Implement tab suggest.
      } else if (e.keyCode == 13) {
        // enter
        // Save shell history.
        if (this.value) {
          history_[history_.length] = this.value;
          histpos_ = history_.length;
        }

        // Duplicate current input and append to output section.
        var line = this.parentNode.parentNode.cloneNode(true);
        line.removeAttribute("id");
        line.classList.add("line");
        var input = line.querySelector("input.cmdline");
        input.autofocus = false;
        input.readOnly = true;
        output_.appendChild(line);

        if (this.value && this.value.trim()) {
          var args = this.value.split(" ").filter(function(val, i) {
            return val;
          });
          var cmd = args[0].toLowerCase();
          args = args.splice(1); // Remove cmd from arg list.
        }

        switch (cmd) {
          case "clear":
            output_.innerHTML = "";
            this.value = "";
            output(
              "<span>&nbsp;&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;______&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;______&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__                </span></br>" +
                "<span>&nbsp;&nbsp;/&nbsp;_&nbsp;|&nbsp;/&nbsp;/&nbsp;&nbsp;__&nbsp;_&nbsp;&nbsp;___&nbsp;___/&nbsp;/&nbsp;/&nbsp;__/&nbsp;/&nbsp;&nbsp;___&nbsp;____&nbsp;_/&nbsp;/&nbsp;&nbsp;___&nbsp;____&nbsp;(&nbsp;)___&nbsp;&nbsp;&nbsp;/_&nbsp;&nbsp;__/__&nbsp;______&nbsp;_&nbsp;&nbsp;(_)__&nbsp;&nbsp;___&nbsp;_/&nbsp;/                </span></br>" +
                "<span>&nbsp;/&nbsp;__&nbsp;|/&nbsp;_&nbsp;&#92;/&nbsp;&nbsp;'&nbsp;&#92;/&nbsp;-_)&nbsp;_&nbsp;&nbsp;/&nbsp;_&#92;&nbsp;&#92;/&nbsp;_&nbsp;&#92;/&nbsp;_&nbsp;`/&nbsp;_&nbsp;`/&nbsp;_&nbsp;&#92;/&nbsp;_&nbsp;`/&nbsp;_&nbsp;&#92;|/(_-<&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;-_)&nbsp;__/&nbsp;&nbsp;'&nbsp;&#92;/&nbsp;/&nbsp;_&nbsp;&#92;/&nbsp;_&nbsp;`/&nbsp;/&nbsp;                </span></br>" +
                "<span>/_/&nbsp;|_/_//_/_/_/_/&#92;__/&#92;_,_/&nbsp;/___/_//_/&#92;_,_/&#92;_,_/_.__/&#92;_,_/_//_/&nbsp;/___/&nbsp;&nbsp;&nbsp;/_/&nbsp;&nbsp;&#92;__/_/&nbsp;/_/_/_/_/_//_/&#92;_,_/_/&nbsp;&nbsp;</span>"
            );
            output(
              '<h2 style="letter-spacing: 4px">Welcome to my Terminal</h2><p>' +
                new Date() +
                '</p><p>Enter "help" for more information.</p>'
            );
            return;
          case "clock":
            var appendDiv = jQuery($(".clock-container")[0].outerHTML);
            appendDiv.attr("style", "display:inline-block");
            output_.appendChild(appendDiv[0]);
            break;
          case "date":
            output(new Date());
            break;
          case "echo":
            output(args.join(" "));
            break;
          case "help":
            output('<div class="ls-files">' + CMDS_.join("<br>") + "</div>");
            break;
          case "uname":
            output(navigator.appVersion);
            break;
          case "whoami":
            output(
              "<p> After discovering my passion for web development, I couldn’t get enough. \
              I made websites for friends and family, interned with a local business, and  \
              hired myself out as a freelancer.i have been using Microsoft technologies in \
              building up web application as i used it in my bachelor project then  i  started \
              working with java script technologies like node.js and angular.js. afterwards i \
              switched to use ruby and off course ruby on rails. at that point of time i  \
              gained a lot of interest in distributing systems, cloud architecture and cloud \
              computing in general, so i learned creating micro-services in different programming languages \
              i had previously worked with in additional to golang. made myself familiar with cloud \
              solution provided by AWS and GCP so that i could use the best solution for implementing \
              complex architectural systems </p>"
            );
            output(
              'Please visit my linkedin profile by clicking <a href="https://www.linkedin.com/in/ahmedshaaban95/" target="_blank">here</a>'
            );
            output(
              'Or you can view my resume from <a href="https://drive.google.com/open?id=1vYIXiQq647fRsXiBBdC08kkaGBA-mHR_" target="_blank">here</a>'
            );
            break;
          case "projects":
            output(
              "<h2>Delivery Hero - Fluid Platform</h2> \
              <p> Server-Driven-UI solution helping teams to customise customer experience flexibly in \
              real-time, improving the time-to-market by removing the dependency on the app release \
              cycle, creating configuration management portal to allow product team and stakeholders to \
              perform changes with low dependency on engineering, providing Backend contains the logic \
              to control the end-to-end experience on the clients. Making modifications and additions \
              a lot less costly </p>"
            );
            output(
              "<h2>Delivery Hero - Geolocator Service</h2> \
              <p> I was a part of the team who was responsible for building the backend of geo-location service \
              enabling more than 300 million Delivery Hero customers around the world, making sure that \
              the service was scalable and robust enough to handle more than 5 million requests per 1 hour \
              by adding the correct monitoring and alerting for service and making sure that the service \
              can handle more than 10x production requests load. </p>"
            );
            output(
              "<h2>Instabug - Users Service</h2> \
              <p> I was responsible for migrating 1.5 billion users to a new database with a new partitioned \
              database cluster hosted by AWS with zero downtime by using double writes concept, \
              caching mechanism using Redis, kubernetes pods, and optimising the already implemented \
              Ruby worker with Go workers. the sum of the previous factors achieved faster database \
              querying and lowering the cost of the database cluster compared to the old database. </p>"
            );
            output(
              "<h2>Extreme Solution - Reach-VoD</h2> \
              <p> Video on Demand platform using mediadrop ’open source video platform’ as a CMS integrated \
              with in house trans-coder app engine and google cloud storage. I was responsible for improving \
              the CMS to match the requirements of the project, building the in house transcoder using  mpeg \
              then containerizing this function in an App Engine and fnally implementing Google’s \
              PubSub in the CMS, Transcoder App Engine and Google Storage. Technologies used: \
              GCS, Pylons, Pubsub, fmpeg, NodeJS, Postgres and Docker. </p>"
            );
            break;
          default:
            if (cmd) {
              output(cmd + ": command not found");
            }
        }

        window.scrollTo(0, getDocHeight_());
        this.value = ""; // Clear/setup line for next input.
      }
    }

    //
    function formatColumns_(entries) {
      var maxName = entries[0].name;
      util.toArray(entries).forEach(function(entry, i) {
        if (entry.name.length > maxName.length) {
          maxName = entry.name;
        }
      });

      var height =
        entries.length <= 3 ? "height: " + entries.length * 15 + "px;" : "";

      // 12px monospace font yields ~7px screen width.
      var colWidth = maxName.length * 7;

      return [
        '<div class="ls-files" style="-webkit-column-width:',
        colWidth,
        "px;",
        height,
        '">'
      ];
    }

    //
    function output(html) {
      output_.insertAdjacentHTML("beforeEnd", "<p>" + html + "</p>");
    }

    // Cross-browser impl to get document's height.
    function getDocHeight_() {
      var d = document;
      return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
      );
    }

    //
    return {
      init: function() {
        output(
          "<span>&nbsp;&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;______&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;______&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__                </span></br>" +
            "<span>&nbsp;&nbsp;/&nbsp;_&nbsp;|&nbsp;/&nbsp;/&nbsp;&nbsp;__&nbsp;_&nbsp;&nbsp;___&nbsp;___/&nbsp;/&nbsp;/&nbsp;__/&nbsp;/&nbsp;&nbsp;___&nbsp;____&nbsp;_/&nbsp;/&nbsp;&nbsp;___&nbsp;____&nbsp;(&nbsp;)___&nbsp;&nbsp;&nbsp;/_&nbsp;&nbsp;__/__&nbsp;______&nbsp;_&nbsp;&nbsp;(_)__&nbsp;&nbsp;___&nbsp;_/&nbsp;/                </span></br>" +
            "<span>&nbsp;/&nbsp;__&nbsp;|/&nbsp;_&nbsp;&#92;/&nbsp;&nbsp;'&nbsp;&#92;/&nbsp;-_)&nbsp;_&nbsp;&nbsp;/&nbsp;_&#92;&nbsp;&#92;/&nbsp;_&nbsp;&#92;/&nbsp;_&nbsp;`/&nbsp;_&nbsp;`/&nbsp;_&nbsp;&#92;/&nbsp;_&nbsp;`/&nbsp;_&nbsp;&#92;|/(_-<&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;-_)&nbsp;__/&nbsp;&nbsp;'&nbsp;&#92;/&nbsp;/&nbsp;_&nbsp;&#92;/&nbsp;_&nbsp;`/&nbsp;/&nbsp;                </span></br>" +
            "<span>/_/&nbsp;|_/_//_/_/_/_/&#92;__/&#92;_,_/&nbsp;/___/_//_/&#92;_,_/&#92;_,_/_.__/&#92;_,_/_//_/&nbsp;/___/&nbsp;&nbsp;&nbsp;/_/&nbsp;&nbsp;&#92;__/_/&nbsp;/_/_/_/_/_//_/&#92;_,_/_/&nbsp;&nbsp;</span>"
        );
        output(
          '<h2 style="letter-spacing: 4px">Welcome to my Terminal</h2><p>' +
            new Date() +
            '</p><p>Enter "help" for more information.</p>'
        );
      },
      output: output
    };
  };

$(function() {
  // Set the command-line prompt to include the user's IP Address
  //$('.prompt').html('[' + codehelper_ip["IP"] + '@HTML5] # ');
  $(".prompt").html("[user@ASTerminal] # ");

  // Initialize a new terminal object
  var term = new Terminal("#input-line .cmdline", "#container output");
  term.init();

  // Update the clock every second
  setInterval(function() {
    function r(cls, deg) {
      $("." + cls).attr("transform", "rotate(" + deg + " 50 50)");
    }
    var d = new Date();
    r("sec", 6 * d.getSeconds());
    r("min", 6 * d.getMinutes());
    r("hour", 30 * (d.getHours() % 12) + d.getMinutes() / 2);
  }, 1000);
});
