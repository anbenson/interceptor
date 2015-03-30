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
    // search for teleports
    var teleRow1 = null;
    var teleCol1 = null;
    var teleRow2 = null;
    var teleCol2 = null;
    for (var row = 0; row < puzzle.length; row++) {
      for (var col = 0; col < puzzle[row].length; col++) {
        if (puzzle[row][col] == config.teleSym) {
          if (teleRow1 === null) {
            teleRow1 = row;
            teleCol1 = col;
          }
          else {
            teleRow2 = row;
            teleCol2 = col;
          }
        }
      }
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
        // teleports are only allowed to the right of an empty space
        if (puzzle[startRow][startCol+1] === config.teleSym) {
          puzzle[startRow][startCol] = config.emptySym;
          if (startRow === teleRow1 && (startCol + 1) === teleCol1) {
            puzzle[teleRow2][teleCol2-1] = config.playerSym;
          }
          else {
            puzzle[teleRow1][teleCol1-1] = config.playerSym;
          }
          break;
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
