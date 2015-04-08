// puzzleTeams.js
// Andrew Benson
// module that handles puzzleTeams

var teams = require("./teams");
var levels = require("./levels");
var loadLevel = function(team, level) {
  team.puzzleConfig = {};
  for (var key in levels[level].puzzleConfig) {
    team.puzzleConfig[key] = levels[level].puzzleConfig[key];
  }
  team.calculateHint = levels[level].calculateHint;
  team.currPuzzle = [];
  for (var row = 0; row < levels[level].currPuzzle.length; row++) {
    team.currPuzzle.push([]);
    for (var col = 0; col < levels[level].currPuzzle.length; col++) {
      team.currPuzzle[row].push(levels[level].currPuzzle[row][col]);
    }
  }
};

// object that keeps track of socket-team associations
// register sockets with setPlayer and setObserver
// lookup teams with lookup and delete sockets with delete
// please do not access socketMap and teams directly
function PuzzleTeams() {
  // maps socket ids to teams
  this.socketMap = {};
  // load the teams
  this.teams = [];
  for (var i = 0; i < teams.length; i++) {
    this.teams.push({});
    for (var key in teams[i]) {
      this.teams[i][key] = teams[i][key];
    }
  }
  // load the levels
  for (var j = 0; j < this.teams.length; j++) {
    loadLevel(this.teams[j], this.teams[j].puzzleLevel);
  }
  // most methods return a boolean (whether they succeeded)
  
  // given a socket, find the corresponding team if it exists
  this.lookup = function(socket) {
    if (socket.id in this.socketMap) {
      return this.socketMap[socket.id];
    }
    return null;
  };
  // given a socket, remove the socket
  this.delete = function(socket) {
    if (socket.id in this.socketMap) {
      var struct = this.socketMap[socket.id];
      if (struct.player && socket.id === struct.player.id) {
        struct.player = null;
      }
      else {
        struct.observer = null;
      }
      delete this.socketMap[socket.id];
      return true;
    }
    return false;
  };
  // given a socket and identifier, register the socket as a player
  this.setPlayer = function(socket, iden, password) {
    // check socket isn't already registered and team exists without player
    if (socket.id in this.socketMap) {
      return false;
    }
    var team = null;
    for (var i = 0; i < this.teams.length; i++) {
      if (this.teams[i].iden === iden) {
        team = this.teams[i];
        break;
      }
    }
    if (team === null) {
      return "Invalid team name";
    }

    // check password
    if (team.password != password) {
      return "Invalid password";
    }

    // check that player isnt already registered
    if (team.player !== null) {
      if (team.observer !== null) {
        return "Looks like this team has both a Player and Observer! Try another team!";
      } else {
        return "Mover already registered, try being the Observer";
      }
    }

    // register socket as player
    team.player = socket;
    this.socketMap[socket.id] = team;
    return true;
  };
  // given a socket and identifier, register the socket as an observer
  this.setObserver = function(socket, iden, password) {
    // check socket isn't already registered and team exists without observer
    if (socket.id in this.socketMap) {
      return false;
    }
    var team = null;
    for (var i = 0; i < this.teams.length; i++) {
      if (this.teams[i].iden === iden) {
        team = this.teams[i];
        break;
      }
    }
    if (team === null) {
      return "Invalid team name";
    }

    // check password
    if (team.password != password) {
      return "Invalid password";
    }

    // check that observer isnt already registered
    if (team.observer !== null) {
      if (team.player !== null) {
        return "Looks like this team has both a Player and Observer! Try another team!";
      } else {
        return "Observer already registered, try being the Mover";
      }
    }

    // register socket as observer
    team.observer = socket;
    this.socketMap[socket.id] = team;
    return true;
  };
  // given a team, loads the puzzle for the next level
  // returns whether the operation succeeded
  this.nextLevel = function(team) {
    // if we're out of levels, signal this
    if (team.puzzleLevel == levels.length-1) {
      return false;
    }
    loadLevel(team, team.puzzleLevel+1);
    team.puzzleLevel++;
    return true;
  };
  // resets the given teams current level to its starting configuration
  this.resetLevel = function(team) {
    loadLevel(team, team.puzzleLevel);
  };
}

module.exports = function() {
  return new PuzzleTeams();
};
