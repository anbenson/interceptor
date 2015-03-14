// server.js
// Andrew Benson
// manages puzzle clients and serves appropriate puzzles

// basic setup
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var puzzleTeams = require("./puzzleTeams")();
var puzzle = require("./puzzle");

// static files
app.use("/js", express.static(__dirname+"/js"));
app.use("/css", express.static(__dirname+"/css"));

// http routing
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

// socket.io routing
// clients must be able to receive the following events:
// puzzleError, puzzleUpdate
// clients must be able to send the following events:
// register, move
io.on("connection", function(socket) {
  console.log("new connection...");
  // register: register socket with team in server records so we know who they
  // are on future messages
  socket.on("register", function(teamname, password, isPlayer) {
    // check parameter types
    if (typeof(teamname) != "string" || typeof(password) != "string" ||
        typeof(isPlayer) != "boolean") {
      socket.emit("puzzleError", "invalid parameters for register");
      return;
    }
    // for now, ignore the password...
    // register the client
    var success;
    if (isPlayer) {
      success = puzzleTeams.setPlayer(socket, teamname);
    }
    else {
      success = puzzleTeams.setObserver(socket, teamname);
    }
    // log results and send initial puzzle
    if (!success) {
      socket.emit("puzzleError", "could not register; are you already "+
                    " registered, or do you have the wrong password?");
      console.log("failed to register "+teamname+" with password "+password+
                  " with "+(isPlayer?"player":"observer"));
      return;
    }
    var team = puzzleTeams.lookup(socket);
    if (isPlayer) {
      socket.emit("puzzleUpdate",
                  JSON.stringify(puzzle.removeObstacles(team.currPuzzle,
                                                        team.puzzleConfig)),
                  JSON.stringify(team.puzzleConfig));
    }
    else {
      socket.emit("puzzleUpdate",
                  JSON.stringify(team.currPuzzle),
                  JSON.stringify(team.puzzleConfig));
    }
    console.log("registered "+teamname+" with "+(isPlayer?"player":"observer"));
  });
  socket.on("move", function(dir) {
    console.log("received move request");
    var team = puzzleTeams.lookup(socket);
    if (!team) {
      socket.emit("puzzleError", "please register first");
      return;
    }
    puzzle.move(team.currPuzzle, team.puzzleConfig, dir);
    if (team.player) {
      team.player.emit("puzzleUpdate",
                       JSON.stringify(puzzle.removeObstacles(team.currPuzzle,
                                                           team.puzzleConfig)),
                       JSON.stringify(team.puzzleConfig));
    }
    if (team.observer) {
      team.observer.emit("puzzleUpdate",
                         JSON.stringify(team.currPuzzle),
                         JSON.stringify(team.puzzleConfig));
    }
  });
  // disconnect: unregister socket in server records
  socket.on("disconnect", function() {
    if (!puzzleTeams.delete(socket)) {
      console.log("error in deleting "+socket.id);
    }
    console.log("socket disconnected...");
  });
});

// actually listen
var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log("Listening at port 3000");
});
