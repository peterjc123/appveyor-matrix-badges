var express = require('express');
var http = require("http");
var https = require("https");
var request = require('request');
var fs = require('fs');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
//  /^\/(.+)/
app.get("/repos/(*)", function (req, res) {
  var self = this;
  var repo = req.params[0];
  var requestedJobNumber = "";
  var fileName = repo.replace(new RegExp('/', 'g'), '-') + '.svg'

  if (fs.existsSync(fileName)) {
    var img = fs.readFileSync(fileName);

    res.header("Cache-Control", "no-cache, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "Thu, 01 Jan 1970 00:00:00 GMT");
    res.header("content-type", "image/svg+xml;charset=utf-8");
    res.end(img, 'binary');
  } else {
    res.redirect('/update/' + repo)
  }
});

app.get("/update/(*)", function (req, res) {
  var self = this;
  var repo = req.params[0];
  var requestedJobNumber = "";
  var fileName = repo.replace(new RegExp('/', 'g'), '-') + '.svg'
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
  var options = {
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
        if (state == "success") {
          var url = "https://img.shields.io/badge/build-passing-brightgreen.svg?logo=appveyor";
          redirect(url, state, res);
          download(url, fileName, null);
        } else if (state == "failed") {
          var url = "https://img.shields.io/badge/build-failure-red.svg?logo=appveyor";
          redirect(url, state, res);
          download(url, fileName, null);
        } else {
          var url = "https://img.shields.io/badge/build-" + state + "-yellow.svg?logo=appveyor";
          redirect(url, state, res);
          download(url, fileName, null);
        }
      });
      if (foundRequestedJobNumber) return;
      res.status(400);
      url = req.url;
      res.send('Job Number was not found');
    } else {
      res.status(400);
      url = req.url;
      res.send('Build was not found');
    }
  })
});

var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(cb); // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

function redirect(url, state, res) {
  request.get(url, function (err, response, body) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.header("Cache-Control", "no-cache, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "Thu, 01 Jan 1970 00:00:00 GMT");
    res.header("ETag", state);
    res.header("content-type", "image/svg+xml;charset=utf-8");
    res.status(response.statusCode).send(body);
  });
}

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});