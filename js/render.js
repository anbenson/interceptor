// render.js
// Andrew Benson
// Renders a string-encoded puzzle to the canvas.
;(function(){
  window.onload = function() {
    // helper functions
    function drawCell(cfg, ctx, row, col, color, shape) {
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
    function drawFromString(cfg, ctx, puzzleStr) {
      // check dimensions as a courtesy
      if (puzzleStr.length !== cfg.numRows*cfg.numCols) {
        console.log("warning: puzzleStr had unexpected length "+
                    puzzleStr.length.toString()+" (not "+
                    (cfg.numRows*cfg.numCols).toString()+")");
      }
      for (var i = 0; i < puzzleStr.length; i++) {
        var row = Math.floor(i / cfg.numCols);
        var col = i % cfg.numCols;
        switch (puzzleStr[i]) {
          case cfg.startSym: {
            drawCell(cfg, ctx, row, col, cfg.startColor, "circle");
            break;
          }
          case cfg.targetSym: {
            drawCell(cfg, ctx, row, col, cfg.targetColor, "square");
            break;
          }
          case cfg.obstacleSym: {
            drawCell(cfg, ctx, row, col, cfg.obstacleColor, "square");
            break;
          }
          case cfg.emptySym: {
            drawCell(cfg, ctx, row, col, cfg.emptyColor, "square");
            break;
          }
          default: {
            console.log("warning: puzzleStr had unexpected symbol: "+
            puzzleStr[i]);
          }
        }
      }
    }
    
    // access dom for canvas
    var canvas = document.getElementById("puzzle");
    var ctx = canvas.getContext("2d");
    canvas.height = canvas.width;
    var numRows = 5;
    var cellSize = canvas.width/numRows;
    var cfg = {
      numRows: numRows,
      numCols: numRows,
      cellSize: cellSize,
      startSym: "0",
      targetSym: "X",
      obstacleSym: "#",
      emptySym: " ",
      startColor: "blue",
      targetColor: "pink",
      obstacleColor: "black",
      emptyColor: "white"
    };
    drawFromString(cfg, ctx, "0   #"+
                             "# #  "+
                             "   ##"+
                             " #  #"+
                             "### X");
  };
})();
