var express = require('express');
var http = require("http");
var https = require("https");
var request = require('request');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
//  /^\/(.+)/
app.get("/repos/(*)", function (req, res) {
  var self = this;
  var repo = req.params[0];
  var requestedJobNumber = "";
  var tokens = repo.split("/");
  requestedJobNumber = tokens[tokens.length - 1];
  if (requestedJobNumber == "") {
    res.status(400);
    url = req.url;
    res.send('Job number is missing from the url');
    return;
  }
  repo = repo.slice(0, repo.lastIndexOf("/"));
  //console.log(repo);
  var options =
    {
      url: "https://ci.appveyor.com/api/projects/" + repo
    };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body); 
      var json = JSON.parse(body);
      var jobs = json.build.jobs;
      if (!jobs) {
        res.status(400);
        url = req.url;
        res.send('Jobs were not found for build');
      }

      var foundRequestedJobNumber = false;
      var currentJobNumber = 0;
      jobs.forEach(function (job) {
        currentJobNumber++;
        var state = job.status;
        if (requestedJobNumber != currentJobNumber) return;
        foundRequestedJobNumber = true;
        res.header("Cache-Control", "no-cache");
        res.header("Expires", "Thu, 01 Jan 1970 00:00:00 GMT");
        if (state == "success") {
          redirect("https://img.shields.io/badge/build-passing-brightgreen.svg", state, res)
        }
        else if (state == "failed") {
          redirect("https://img.shields.io/badge/build-failure-red.svg", state, res);
        }
        else {
          var url = "https://img.shields.io/badge/build-" + state + "-yellow.svg";
          redirect(url, state, res);
        }
      });
      if (foundRequestedJobNumber) return;
      res.status(400);
      url = req.url;
      res.send('Job Number was not found');
    }

    else {
      res.status(400);
      url = req.url;
      res.send('Build was not found');
    }
  })
});

function redirect(url, state, res) {
  res.header("ETag", state);
  url = url + "?maxAge=5";
  res.redirect(url);
  //request.get(url, function(err, response, body) {
  //  if (err) res.send(err);
  //  else res.send(body);
  //});
}

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});