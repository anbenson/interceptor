// puzzle.js
// Andrew Benson
// module that handles puzzle operations

module.exports = {
  // does the move operation on the puzzle
  // returns whether the operation succeeded
  move: function(puzzle, config, dir) {
    // search for playerSym
    var startRow = null;
    var startCol = null;
    for (var row = 0; row < puzzle.length; row++) {
      for (var col = 0; col < puzzle[row].length; col++) {
        if (puzzle[row][col] == config.playerSym) {
          startRow = row;
          startCol = col;
          break;
        }
      }
    }
    if (startRow === null || startCol === null) {
      return "no playerSym";
    }
    // make movement if possible
    switch(dir) {
      case "L": {
        if (startCol === 0) {
          return "invalid move";
        }
        if (puzzle[startRow][startCol-1] === config.obstacleSym) {
          return false;
        }
        puzzle[startRow][startCol] = config.emptySym;
        puzzle[startRow][startCol-1] = config.playerSym;
        break;
      }
      case "R": {
        if (startCol === puzzle[startRow].length-1) {
          return "invalid move";
        }
        if (puzzle[startRow][startCol+1] === config.obstacleSym) {
          return false;
        }
        puzzle[startRow][startCol] = config.emptySym;
        puzzle[startRow][startCol+1] = config.playerSym;
        break;
      }
      case "U": {
        if (startRow === 0) {
          return "invalid move";
        }
        if (puzzle[startRow-1][startCol] === config.obstacleSym) {
          return false;
        }
        puzzle[startRow][startCol] = config.emptySym;
        puzzle[startRow-1][startCol] = config.playerSym;
        break;
      }
      case "D": {
        if (startRow === puzzle.length-1) {
          return "invalid move";
        }
        if (puzzle[startRow+1][startCol] === config.obstacleSym) {
          return false;
        }
        puzzle[startRow][startCol] = config.emptySym;
        puzzle[startRow+1][startCol] = config.playerSym;
        break;
      }
      default: {
        return false;
      }
    }
    return true;
  },
  // returns a new puzzle where obstacles are replaced with empties
  removeObstacles: function(puzzle, config) {
    var result = [];
    for (var row = 0; row < puzzle.length; row++) {
      result.push([]);
      for (var col = 0; col < puzzle[row].length; col++) {
        if (puzzle[row][col] === config.obstacleSym) {
          result[row].push(config.emptySym);
        }
        else {
          result[row].push(puzzle[row][col]);
        }
      }
    }
    return result;
  },
  // if there's still a target, you haven't won yet
  isWon: function(puzzle, config) {
    for (var row = 0; row < puzzle.length; row++) {
      for (var col = 0; col < puzzle[row].length; col++) {
        if (puzzle[row][col] === config.targetSym) {
          return false;
        }
      }
    }
    return true;
  },
};
