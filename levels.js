// levels.js
// Andrew Benson
// stores puzzle levels and their configurations

module.exports = [
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
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
      level: 1
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
      level: 1
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

  }
];
