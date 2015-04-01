// render.js
// Andrew Benson
// Renders a string-encoded puzzle to the canvas.

var currDotInterval = null;
var currDotTimeout = null;
var gameStarted = false;
var puzzleSize = 5;
var socket = io();
var player_type;
var canvas;
var ctx;
var viewCfg;

var parsedPuzzleCfg;
var parsedPuzzle;
var parsedHint;

function load_globals() {
  canvas = document.getElementById("puzzle");
  ctx = canvas.getContext("2d");
}

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
        case puzzleCfg.teleSym: {
          drawCell(ctx, viewCfg, row, col, viewCfg.teleColor, "square");
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

function drawBlinkingDot(ctx, puzzleCfg, viewCfg, puzzle, coords, color) {
  if (!coords) {
    return;
  }
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

function register_key_events() {
  window.addEventListener("keydown", function(e) {
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
}

// credit for this function comes from
// http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY};
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function register_mouse_events() {
  if (player_type == "Observer") {
    canvas.addEventListener("click", function(event) {
      coords = canvas.relMouseCoords(event);
      var row = Math.floor(coords.y / viewCfg.cellSize);
      var col = Math.floor(coords.x / viewCfg.cellSize);
      socket.emit("hint", JSON.stringify([row, col]));
    });
  }
}

function redraw_all() {
  drawPuzzle(ctx, parsedPuzzleCfg, viewCfg, parsedPuzzle);
  drawBlinkingDot(ctx, parsedPuzzleCfg, viewCfg, parsedPuzzle, parsedHint,
                    "red");
}

function initGame() {
  gameStarted = true;
  $(".registration-row").hide(1000);
  $(".game-row").show(1000);
  $(".level-row").show(1000);
  $(".error-msg-text").text("");
  player_type = $(".player-type-input").val();
  register_key_events();
  register_mouse_events();
}

function register_socket_handlers() {
  // connect to socket server and register callbacks
  socket.on("puzzleError", function(msg) {
    if (!gameStarted) {
      $(".error-msg-text").text(msg);
    }
  });
  socket.on("puzzleUpdate", function(puzzle, puzzleCfg, observerHint) {
    // if game hasnt started yet then initialize the view and controllers
    // to begin
    if (!gameStarted) {
      initGame();
    }
    parsedPuzzleCfg = JSON.parse(puzzleCfg);
    $(".level-number").text("Level: " + parsedPuzzleCfg.level);
    parsedPuzzle = JSON.parse(puzzle);
    puzzleSize = parsedPuzzle.length;
    parsedHint = JSON.parse(observerHint);
    redraw_all();
    resize_page_handle();
  });
}

function resize_page_handle() {
  canvas.height = $(window).height() - Math.max(240, $(".logo-row").height()) - 60;
  canvas.width = canvas.height;
  if (canvas.height > $(window).width()) {
    canvas.height = $(window).width() - 30;
    canvas.width = canvas.height;
  }
  
  var numRows = puzzleSize;
  var cellSize = canvas.width/numRows;
  viewCfg = {
    cellSize: cellSize,
    playerColor: "blue",
    targetColor: "pink",
    obstacleColor: "black",
    emptyColor: "white",
    teleColor: "green",
  };
  if (gameStarted)
    redraw_all();
}

login_data = {
  team_name: "",
  pw: "",
  player_type: "Observer"
};

function initialize_login_data() {
  login_data.team_name = $(".team-name-input").val();
  login_data.pw = $(".password-input").val();
}

function can_click_start() {
  if (login_data.team_name.length < 1) return false;
  if (login_data.pw.length < 1) return false;
  if (login_data.pw.length < 1) return false;
  return true;
}

function activate_button() {
  $(".start-button").removeAttr("disabled");
}

function deactivate_button() {
  $(".start-button").attr("disabled", true);
}

function toggle_button_active() {
  if (can_click_start()) activate_button();
  else deactivate_button();
}

function load_click_handlers() {
  $(".team-name-input").change(function() {
    login_data.team_name = $(this).val();
    toggle_button_active();
  });

  $(".password-input").change(function() {
    login_data.pw = $(this).val();
    toggle_button_active();
  });

  $(".player-type-input").change(function() {
    login_data.player_type = $(this).val();
    toggle_button_active();
  });

  $(".start-button").click(function() {
    var isPlayer;
    if (login_data.player_type == "Observer") isPlayer = false;
    else isPlayer = true;
    console.log(isPlayer);
    socket.emit("register", login_data.team_name, login_data.pw, isPlayer);
  });

  $(".instructions-button").click(function() {
    $(".instructions-row").hide(500);
    $(".registration-row").show(500);
  });
}

window.onresize = resize_page_handle;

$(document).ready(function() {
  load_globals();
  initialize_login_data();
  toggle_button_active();
  resize_page_handle();
  register_socket_handlers();
  load_click_handlers();
});
