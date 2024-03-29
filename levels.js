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
      state: "normal",
      keybindings: {
        "U": "U",
        "D": "D",
        "L": "L",
        "R": "R"
      }
    },
    "calculateHint": function(puzzle, currHint, click) {
      return click;
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
      state: "normal",
      keybindings: {
        "U": "U",
        "D": "D",
        "L": "L",
        "R": "R"
      }
    },
    "calculateHint": function(puzzle, currHint, click) {
      return click;
    },
    "currPuzzle": [["#"," "," "," ","0"],
                   [" "," ","#"," ","#"],
                   ["#","#","#"," "," "],
                   [" "," "," ","#"," "],
                   ["X","#"," "," "," "]]
  },
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 2,
      state: "normal",
      keybindings: {
        "U": "U",
        "D": "D",
        "L": "R",
        "R": "L"
      }
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      return [puzzle.length-1-click[1], puzzle[0].length-1-click[0]];
    },
    "currPuzzle": [["0"," ","#"," ","T"],
                   ["#"," "," "," ","#"],
                   ["X","#","#"," "," "],
                   [" "," "," ","#","#"],
                   [" ","#"," "," ","T"]]
  },
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 3,
      state: "normal",
      keybindings: {
        "U": "D",
        "D": "U",
        "L": "L",
        "R": "R"
      }
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
      level: 4,
      state: "normal",
      keybindings: {
        "U": "R",
        "D": "L",
        "L": "D",
        "R": "U"
      }
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      var drow = currHint[0] - click[0];
      var dcol = currHint[1] - click[1];
      var nrow = (currHint[0] + drow + puzzle.length) % puzzle.length;
      var ncol = (currHint[1] + dcol + puzzle[0].length) % puzzle[0].length;
      return [nrow, ncol];
    },
    "currPuzzle": [[" ","T","#","#"," "," "," "," "," ","X",],
                   [" ","#"," "," "," ","#","#"," ","#","#",],
                   [" "," ","#"," ","#","#","#"," ","#","0",],
                   ["#"," ","#"," ","#"," "," "," ","#"," ",],
                   ["#"," ","#"," "," "," ","#","#","#"," ",],
                   [" "," ","#"," "," ","#"," "," ","#"," ",],
                   [" ","#"," "," ","#","#"," ","#","#"," ",],
                   [" ","#"," ","#"," "," "," "," ","#"," ",],
                   [" ","#"," ","#"," ","#","#"," "," "," ",],
                   [" "," "," ","#"," "," ","T","#"," ","#",]]
  },
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      teleSym: "T",
      level: 5,
      state: "normal",
      keybindings: {
        "U": "L",
        "D": "U",
        "L": "R",
        "R": "D"
      }
    },
    "calculateHint": function(puzzle, currHint, click) {
      if (!currHint) {
        return click;
      }
      var drow = currHint[0] - click[0];
      var dcol = currHint[1] - click[1];
      var nrow = (currHint[0] + drow + puzzle.length) % puzzle.length;
      var ncol = (currHint[1] + dcol + puzzle[0].length) % puzzle[0].length;
      return [nrow, ncol];
    },
    "currPuzzle": [[" "," "," "," "," ","#"," "," "," "," ",],
                   ["#"," ","#","#"," "," ","#"," ","#"," ",],
                   [" "," "," "," ","#"," "," "," ","#"," ",],
                   [" ","#","#"," "," ","#"," ","#"," "," ",],
                   [" "," "," "," "," "," ","#"," "," ","#",],
                   ["#","#"," ","#","#"," ","#"," ","#"," ",],
                   [" "," "," "," "," "," ","#"," "," ","#",],
                   [" ","#","#"," ","#","#"," ","#"," ","T",],
                   [" "," "," ","#"," "," ","0","#","#","#",],
                   [" ","#"," "," "," ","#","#","X"," ","T",]]
  }
];
