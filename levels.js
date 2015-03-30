// levels.js
// Andrew Benson
// stores puzzle levels and their configurations

// NOTE: there must be an empty space to the left of a teleport,
// and obstacles in every other direction

module.exports = [
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 0,
      state: "normal"
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      return [click[1], click[0]]; // switch row, col
    },
    "currPuzzle": [["0"," "," "," ","#"],
                   ["#","#","#"," ","#"],
                   [" "," "," "," "," "],
                   [" ","#","#","#","#"],
                   [" "," "," "," ","X"]]
  },
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 1,
      state: "normal"
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      return [click[1], click[0]]; // switch row, col
    },
    "currPuzzle": [["0"," "," "," ","#"],
                   ["#"," ","#"," "," "],
                   [" "," ","#","#","#"],
                   [" ","#"," "," "," "],
                   [" "," "," ","#","X"]]
  },
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 2,
      state: "normal"
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      return [click[1], click[0]]; // switch row, col
    },
    "currPuzzle": [["0","#"," "," "," "," ","#"," "," "," ",],
                   [" ","#"," ","#","#","#"," "," ","#"," ",],
                   [" ","#"," "," "," "," ","#"," ","#"," ",],
                   [" "," ","#"," ","#"," ","#"," ","#"," ",],
                   ["#"," "," "," "," "," "," "," ","#"," ",],
                   [" ","#","#"," "," ","#"," ","#","#"," ",],
                   [" "," "," "," ","#","X","#"," ","#"," ",],
                   ["#"," ","#"," ","#"," "," "," ","#"," ",],
                   [" "," "," ","#"," ","#","#"," "," "," ",],
                   [" ","#"," "," "," "," "," "," "," ","#",]]
  },
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 3,
      state: "normal"
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      return [click[1], click[0]]; // switch row, col
    },
    "currPuzzle": [["0","#"," "," "," ","T","#"," "," "," ",],
                   [" ","#"," ","#","#","#"," "," ","#"," ",],
                   [" ","#"," "," ","#"," ","#"," ","#"," ",],
                   [" "," ","#"," ","#"," ","#"," ","#"," ",],
                   ["#"," "," "," ","#"," "," "," ","#"," ",],
                   [" ","#","#","#"," "," ","#","#","#"," ",],
                   [" "," "," "," "," ","#","#"," ","#"," ",],
                   ["#"," ","#"," ","#","X"," "," ","#"," ",],
                   [" "," "," ","#"," ","#","#"," "," "," ",],
                   [" ","#"," "," "," "," ","T","#"," ","#",]]
  }
];
