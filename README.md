# Interceptor
A maze-like puzzle for two parties, with some unexpected twists. For 15-112.

Built on [node.js](http://nodejs.org), [express](http://expressjs.com), and [socket.io](http://socket.io). Why express? Why not?

## Prerequisites
- Install node.js.
- Install npm.

## Installation
- Clone this repo.
- run `npm install`
- run `node server.js`

## API
Before you do anything, register yourself.

### socket.emit("register", teamname, password, isPlayer)
Send the `register` event to register yourself to the server. If successful, you'll receive the `puzzleUpdate` event.

Parameters:
- teamname: a string of your team's name
- password: a string of your team's password. currently optional, because who cares about security right now.
- isPlayer: a boolean of whether you're the player or not. if `false`, the server assumes you're the observer.

### socket.emit("move", dir)
Send the `move` event when you wish to move the player. You must be registered first. All `move` events received from the observer will be ignored. If successful, both the player and observer will receive the `puzzleUpdate` event.

Parameters:
- dir: a string indicating the direction to move in (for one step) - one of `["L", "R", "U", "D"]`. Other values will be ignored. Should be pretty self-explanatory.

### socket.emit("hint", coords)
Send the `hint` event when you wish to send coordinates of a spot on the board where the player should go (of course, the server may intercept and modify your hint along the way). All `hint` events from the player will be ignored. If successful, both the player and observer will receive the `puzzleUpdate` event.

Parameters:
- coords: a string of a JSON-encoded array of two elements, which contain the row and column number of the spot the player ought to go.

### socket.on("puzzleError", function(msg){})
The `puzzleError` message is sent when...you cause an error. You can do what you like with the message.

Parameters:
- msg: a string containing an error message. typically unhelpful.

### socket.on("puzzleUpdate", function(puzzle, puzzleConfig, observerHint, answer){})
The `puzzleUpdate` message is sent whenever the puzzle state has changed, or whenever the server feels like it. It's best not to wonder why and to just draw the puzzle.

Parameters:
- puzzle: a string containing the puzzle 2D-array in JSON form. use JSON.parse to convert into a JavaScript object. the puzzle should be a 2D array of one-character strings, each of which is a cell in the puzzle.
- puzzleConfig: a string containing the puzzle configuration in JSON form. use JSON.parse to convert into a JavaScript object. it looks like the following:

Field       | Type   | Description
------------|--------|------------
playerSym   | string | the character used to denote the player's position in the puzzle
targetSym   | string | the character used to denote the position in the puzzle the player is trying to get to
obstacleSym | string | the character used to denote an obstacle in the puzzle
emptySym    | string | the character used to denote an empty space in the puzzle
level       | number | the level number of the puzzle
state       | string | one of "normal", "reset", or "newLevel". describes the sent puzzle
- observerHint: an array of length 2 in JSON form containing coordinates in the puzzle where the observer thinks the player should go (but modified by the server). can also be null or empty.
- answer: a JSON-encoded string containing the password for finishing the puzzle on the puzzlehunt website. if the game is not won yet, answer will be null (but in JSON form).
