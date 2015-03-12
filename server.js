// server.js
// Andrew Benson
// manages puzzle clients and serves appropriate puzzles

// basic setup
var express = require("express");
var app = express();
var http = require("http").Server(app);

// static files
app.use("/js", express.static(__dirname+"/js"));
app.use("/css", express.static(__dirname+"/css"));

// routing
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

// actually listen
http.listen(3000, function() {
  console.log("Listening at port 3000");
});
