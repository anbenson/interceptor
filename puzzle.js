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
  // the modification made to the observer's hint
  // our current default is to always rotate by -90 degrees
  modifyHint: function(puzzle, curr, click) {
    if (!curr) {
      return click;
    }
    return [click[1],click[0]];
    // // calculate deltas. note that we get row, col
    // var dx = curr[1] - click[1];
    // var dy = -(curr[0] - click[0]); // because top row is 0
    //
    // // derived from matrix rotation for -90 degrees
    // var rx = -1*dy;
    // var ry = dx;
    // var newrow = click[0] - ry; // again, because top row is 0
    // var newcol = click[1] + rx;
    //
    // // why am i doing this? because freakin' JS mods negative numbers wrong
    // var modnewrow = (newrow + puzzle.length) % puzzle.length;
    // var modnewcol = (newcol + puzzle[0].length) % puzzle[0].length;
    //
    // return [modnewrow, modnewcol];
  }
};
