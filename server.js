// server.js
// Andrew Benson
// manages puzzle clients and serves appropriate puzzles

// basic setup
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// static files
app.use("/js", express.static(__dirname+"/js"));
app.use("/css", express.static(__dirname+"/css"));

// http routing
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

// socket.io routing
io.on("connection", function(socket) {
  console.log("new connection...");
  socket.on("disconnect", function() {
    console.log("socket disconnected...");
  });
});

// actually listen
http.listen(3000, function() {
  console.log("Listening at port 3000");
});
