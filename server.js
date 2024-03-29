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
app.use("/imgs", express.static(__dirname+"/imgs"));

// http routing
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

// socket.io routing
// clients must be able to receive the following events:
// puzzleError, puzzleUpdate
// clients must be able to send the following events:
// register, move, hint
io.on("connection", function(socket) {
    // this function updates both the observer and the player
  var updateClient = function(socket, puzzle, config, hint, inPlay) {
    var jpuzzle = JSON.stringify(puzzle);
    var jconfig = JSON.stringify(config);
    var jhint = JSON.stringify(hint);
    var ans = "what would dijkstra do";
    var jans = JSON.stringify(inPlay ? null : ans);
    socket.emit("puzzleUpdate", jpuzzle, jconfig, jhint, jans);
  };
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
    // register the client
    var success;
    if (isPlayer) {
      success = puzzleTeams.setPlayer(socket, teamname, password);
    }
    else {
      success = puzzleTeams.setObserver(socket, teamname, password);
    }
    // log results and send initial puzzle
    if (success !== true) {
      errorMsg = success;
      socket.emit("puzzleError", errorMsg);
      console.log("failed to register "+teamname+" with password "+password+
                  " with "+(isPlayer?"player":"observer"));
      return;
    }
    var team = puzzleTeams.lookup(socket);
    var clearPuzzle = puzzle.removeObstacles(team.currPuzzle,team.puzzleConfig);
    if (isPlayer) {
      updateClient(socket, clearPuzzle, team.puzzleConfig, team.observerHint,
                                                           team.inPlay);
    }
    else {
      updateClient(socket, team.currPuzzle, team.puzzleConfig,
                           team.observerHint, team.inPlay);
    }
    console.log("registered "+teamname+" with "+(isPlayer?"player":"observer"));
  });
  socket.on("move", function(dir) {
    console.log("received move request");
    var team = puzzleTeams.lookup(socket);
    // only move if registered
    if (!team) {
      socket.emit("puzzleError", "please register first");
      return;
    }
    // only move if in play
    if (!team.inPlay) {
      socket.emit("puzzleError", "looks like you've already won!");
      return;
    }
    // cheat code to pass level
    if (dir === "konamicode") {
      team.observerHint = [0,0];
      var newLevelExists = puzzleTeams.nextLevel(team);
      if (!newLevelExists) {
        team.inPlay = false;
      }
      team.puzzleConfig.state = "newLevel";
      // switch player and observer
      var temp = team.player;
      team.player = team.observer;
      team.observer = temp;
      var clearPuzzle = puzzle.removeObstacles(team.currPuzzle,team.puzzleConfig);
      if (team.player) {
        updateClient(team.player, clearPuzzle, team.puzzleConfig,
                                  team.observerHint, team.inPlay);
      }
      if (team.observer) {
        updateClient(team.observer, team.currPuzzle, team.puzzleConfig,
                                    team.observerHint, team.inPlay);
      }
      return;
    }
    // only move if player
    if (!(team.player && socket.id === team.player.id)) {
      return;
    }
    // actually try to move
    var result = puzzle.move(team.currPuzzle, team.puzzleConfig, dir);
    
    // ignore moves off the board
    if (result === "invalid move") {
      return;
    }
    
    // reset the board if the move hit an obstacle
    if (result === false) {
      puzzleTeams.resetLevel(team);
      team.puzzleConfig.state = "reset";
    }
    // if win
    else if (puzzle.isWon(team.currPuzzle, team.puzzleConfig)) {
      team.observerHint = [0,0];
      var newLevelExists = puzzleTeams.nextLevel(team);
      if (!newLevelExists) {
        team.inPlay = false;
      }
      team.puzzleConfig.state = "newLevel";
      // switch player and observer
      var temp = team.player;
      team.player = team.observer;
      team.observer = temp;
    }
    else {
      team.puzzleConfig.state = "normal";
    }
    
    var clearPuzzle = puzzle.removeObstacles(team.currPuzzle,team.puzzleConfig);
    if (team.player) {
      updateClient(team.player, clearPuzzle, team.puzzleConfig,
                                team.observerHint, team.inPlay);
    }
    if (team.observer) {
      updateClient(team.observer, team.currPuzzle, team.puzzleConfig,
                                  team.observerHint, team.inPlay);
    }
  });
  socket.on("hint", function(coords) {
    console.log("received hint request");
    var team = puzzleTeams.lookup(socket);
    // only accept hints if registered
    if (!team) {
      socket.emit("puzzleError", "please register first");
      return;
    }
    // only accept hints if in play
    if (!team.inPlay) {
      socket.emit("puzzleError", "looks like you've already won!");
      return;
    }
    // only accept hints if observer
    if (!(team.observer && socket.id === team.observer.id)) {
      return;
    }
    // update observerHint and update everyone
    var parsedCoords = JSON.parse(coords);
    var clearPuzzle = puzzle.removeObstacles(team.currPuzzle,team.puzzleConfig);
    var newHint = team.calculateHint(team.currPuzzle, team.observerHint,
                                                      parsedCoords);
    team.observerHint = newHint;
    if (team.player) {
      updateClient(team.player, clearPuzzle, team.puzzleConfig, newHint,
                                                                team.inPlay);
    }
    if (team.observer) {
      updateClient(team.observer, team.currPuzzle, team.puzzleConfig, newHint,
                                                   team.inPlay);
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
