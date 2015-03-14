// puzzleTeams.js
// Andrew Benson
// module that handles puzzleTeams

// object that keeps track of socket-team associations
// register sockets with setPlayer and setObserver
// lookup teams with lookup and delete sockets with delete
// please do not access socketMap and teams directly
function PuzzleTeams() {
  // maps socket ids to teams
  this.socketMap = {};
  // list of registered teams. should be read-only, except for structs within.
  this.teams = [{"iden": "test",
                 "password": "test",
                 "player": null,
                 "observer": null,
                 "observerHint": [0, 1],
                 "puzzleConfig": {
                   playerSym: "0",
                   targetSym: "X",
                   obstacleSym: "#",
                   emptySym: " "
                 },
                 "puzzleMod": [1, 0], // row, col modification
                 "puzzleLevel": 1,
                 "currPuzzle": [["0"," "," "," ","#"],
                                ["#"," ","#"," "," "],
                                [" "," "," ","#","#"],
                                [" ","#"," "," ","#"],
                                ["#","#","#"," ","X"]]
                 }];
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
  this.setPlayer = function(socket, iden) {
    // check socket isn't already registered and team exists without player
    if (socket.id in this.socketMap) {
      return false;
    }
    var team = null;
    for (var i = 0; i < this.teams.length; i++) {
      if (this.teams[i].iden === iden) {
        if (this.teams[i].player) {
          return false;
        }
        team = this.teams[i];
        break;
      }
    }
    if (team === null) {
      return false;
    }
    // register socket as player
    team.player = socket;
    this.socketMap[socket.id] = team;
    return true;
  };
  // given a socket and identifier, register the socket as an observer
  this.setObserver = function(socket, iden) {
    // check socket isn't already registered and team exists without observer
    if (socket.id in this.socketMap) {
      return false;
    }
    var team = null;
    for (var i = 0; i < this.teams.length; i++) {
      if (this.teams[i].iden === iden) {
        if (this.teams[i].observer) {
          return false;
        }
        team = this.teams[i];
        break;
      }
    }
    if (team === null) {
      return false;
    }
    // register socket as observer
    team.observer = socket;
    this.socketMap[socket.id] = team;
    return true;
  };
}

module.exports = function() {
  return new PuzzleTeams();
};
