// levels.js
// Andrew Benson
// stores puzzle levels and their configurations

module.exports = [
  {
    "puzzleConfig": {
      playerSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " "
    },
    "puzzleMod": [0, 0], // row, col modification
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
      emptySym: " "
    },
    "puzzleMod": [1,0],
    "currPuzzle": [["0"," "," "," ","#"],
                   ["#"," ","#"," "," "],
                   [" "," ","#","#","#"],
                   [" ","#"," "," "," "],
                   [" "," "," ","#","X"]]
  }
];