// render.js
// Andrew Benson
// Renders a string-encoded puzzle to the canvas.
;(function(){
  window.onload = function() {
    // helper functions
    function drawCell(ctx, cfg, row, col, color, shape) {
      // save old color, just in case
      var old = ctx.fillStyle;
      // set color, and draw shape
      ctx.fillStyle = color;
      switch (shape) {
        case "square": {
          ctx.fillRect(col*cfg.cellSize, row*cfg.cellSize,
                       cfg.cellSize, cfg.cellSize);
          break;
        }
        case "circle": {
          ctx.beginPath();
          ctx.arc((col+0.5)*cfg.cellSize, (row+0.5)*cfg.cellSize,
                   0.5*cfg.cellSize, 0, 2*Math.PI, false);
          ctx.fill();
          ctx.stroke();
          break;
        }
        default: {
          console.log("unrecognized shape: "+shape+". continuing.");
        }
      }
      // restore old color
      ctx.fillStyle = old;
    }
    function drawPuzzle(ctx, puzzleCfg, viewCfg, puzzle) {
      ctx.clearRect(0, 0, puzzle[0].length*viewCfg.cellSize,
                          puzzle.length*viewCfg.cellSize);
      for (var row = 0; row < puzzle.length; row++) {
        for (var col = 0; col < puzzle[row].length; col++) {
          switch (puzzle[row][col]) {
            case puzzleCfg.playerSym: {
              drawCell(ctx, viewCfg, row, col, viewCfg.playerColor, "circle");
              break;
            }
            case puzzleCfg.targetSym: {
              drawCell(ctx, viewCfg, row, col, viewCfg.targetColor, "square");
              break;
            }
            case puzzleCfg.obstacleSym: {
              drawCell(ctx, viewCfg, row, col, viewCfg.obstacleColor, "square");
              break;
            }
            case puzzleCfg.emptySym: {
              drawCell(ctx, viewCfg, row, col, viewCfg.emptyColor, "square");
              break;
            }
            default: {
              console.log("warning: puzzleStr had unexpected symbol: "+
              puzzle[row][col]);
            }
          }
        }
      }
    }
    var currDotInterval = null;
    var currDotTimeout = null;
    function drawBlinkingDot(ctx, puzzleCfg, viewCfg, puzzle, coords, color) {
      if (currDotTimeout) {
        clearTimeout(currDotTimeout);
      }
      if (currDotInterval) {
        clearInterval(currDotInterval);
      }
      var blink = function() {
        var oldColor = ctx.fillStyle;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc((coords[1]+0.5)*viewCfg.cellSize,
                (coords[0]+0.5)*viewCfg.cellSize,
                0.2*viewCfg.cellSize, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = oldColor;
        currDotTimeout = setTimeout(function() {
          drawPuzzle(ctx, puzzleCfg, viewCfg, puzzle);
        }, 400);
      };
      blink();
      currDotInterval = setInterval(blink, 500);
    }
    
    // access dom for canvas
    var canvas = document.getElementById("puzzle");
    var ctx = canvas.getContext("2d");
    canvas.height = canvas.width;
    var numRows = 5;
    var cellSize = canvas.width/numRows;
    var viewCfg = {
      cellSize: cellSize,
      playerColor: "blue",
      targetColor: "pink",
      obstacleColor: "black",
      emptyColor: "white"
    };
                            
    // connect to socket server and register callbacks
    var socket = io();
    socket.on("puzzleError", function(msg) {
      console.log(msg);
    });
    socket.on("puzzleUpdate", function(puzzle, puzzleCfg) {
      drawPuzzle(ctx, JSON.parse(puzzleCfg), viewCfg, JSON.parse(puzzle));
    });
    socket.emit("register", "test", "test", true);
    window.addEventListener("keydown", function(e) {
      console.log(e);
      // note: the following code is a deprecated API, but stupid Chrome/Safari
      // won't implement the new standard
      switch(e.keyCode) {
        case 38: {
          socket.emit("move", "U");
          break;
        }
        case 40: {
          socket.emit("move", "D");
          break;
        }
        case 37: {
          socket.emit("move", "L");
          break;
        }
        case 39: {
          socket.emit("move", "R");
          break;
        }
        default: {
          return;
        }
      }
    });
  };
})();
