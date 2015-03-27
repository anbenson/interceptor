// puzzleTeams.js
// Andrew Benson
// module that handles puzzleTeams

var levels = require("./levels");
var loadLevel = function(team, level) {
  team.puzzleConfig = {};
  for (var key in levels[level].puzzleConfig) {
    team.puzzleConfig[key] = levels[level].puzzleConfig[key];
  }
  team.puzzleMod = [];
  for (var i = 0; i < levels[level].puzzleMod.length; i++) {
    team.puzzleMod[i] = levels[level].puzzleMod[i];
  }
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
  // list of registered teams. should be read-only, except for structs within.
  this.teams = [
                  {
                    "iden": "test",
                    "password": "test",
                    "player": null,
                    "observer": null,
                    "observerHint": null,
                    "puzzleLevel": 0
                  },
                  {
                    "iden": "test2",
                    "password": "test2",
                    "player": null,
                    "observer": null,
                    "observerHint": null,
                    "puzzleLevel": 0
                  }
               ];
  for (var i = 0; i < this.teams.length; i++) {
    loadLevel(this.teams[i], this.teams[i].puzzleLevel);
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
        return "Player already registered, try being the Observer";
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
        return "Observer already registered, try being the Player";
      }
    }

    // register socket as observer
    team.observer = socket;
    this.socketMap[socket.id] = team;
    return true;
  };
  // given a team, loads the puzzle for the next level
  this.nextLevel = function(team) {
    loadLevel(team, team.puzzleLevel+1);
    team.puzzleLevel++;
  };
}

module.exports = function() {
  return new PuzzleTeams();
};
