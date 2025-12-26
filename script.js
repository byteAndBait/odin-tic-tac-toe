const Game = (() => {
  function Player(name, mark) {
    return { name, mark };
  }
  const GameBoard = (() => {
    const board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    const resetBoard = () => {
      board.forEach((e) => { e[0] = e[1] = e[2] = "" });
      
    };
    
    const mutateBoard = (pos, mark) => {
      // for example pos=13, row one and column three
      
      board[pos[0]][pos[1]] = mark
    };
    
    const getBoard = () => board;
    return { resetBoard, mutateBoard, getBoard };
  })();
  
  const GameController = (() => {
    let players;
    let lastTurnPlayer;
    
    function setupPlayers(firstName, secondName) {
      players = [Player(firstName, "O"), Player(secondName, "X")]
      return `players set up
${players[0].name} as O
${players[1].name} as X`
    }
    
    function playRound(pos) { // example: 21 : second row first column
      if (!(players[0].name || players[1].name)) {
        return "Players weren't chosen"
      }
      lastTurnPlayer = lastTurnPlayer == players[0] ? players[1] : players[0];
      let row = pos[0];
      let column = pos[1];
      if (GameBoard.getBoard()[row][column].length == 0) {
        GameBoard.mutateBoard(pos, lastTurnPlayer.mark);
      } else {
        return "cell is already occupied"
      }
      return {
        status : checkWinAndTie(),
        player : lastTurnPlayer
      }
      
      
    }
    let resetBoard = () => {
      lastTurnPlayer = undefined;
      GameBoard.resetBoard()
    }
    
    function checkWinAndTie() {
      let board = GameBoard.getBoard();
      
      // Win State
      
      // diagonal
      
      if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        return board[0][0];
      }
      
      if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
      }
      
      for (i in board) {
        // horizontal
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
          return board[i][0];
        }
        
        // vertical
        
        if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
          return board[0][i];
        }
        
        // TIE
        
        if ( // check if there is an empty cell remaining
          board[0][i].length == 0 ||
          board[1][i].length == 0 ||
          board[2][i].length == 0)
        {
          return;
        } else if (board[i] == board[2]) { // if it is the last row in the loop
          return "TIE";
        }
      }
    }
    return { playRound, resetBoard, setupPlayers};
  })();
  
  const consoleModule = (() => {
    let playRound = (pos) => {
      let output = GameController.playRound(pos)
      console.log(`${output.player.mark} moved to pos ${pos[0]},${pos[1]}`)
      if (output.status) {
        let result = output.status == "TIE" ? "TIE" : `${output.status} Has Won`
        console.log(result)
        resetBoard()
      }
    }
    let resetBoard = () => {
      GameBoard.resetBoard()
      console.log("board has been reset")
    }
    let setupPlayers = (firstName, secondName) => {
      console.log(GameController.setupPlayers(firstName, secondName))
    }
    return { playRound, resetBoard, setupPlayers };
  })()
  return { consoleModule };
})();


// --- HORIZONTAL WIN ---
console.log("TEST: Horizontal Win");
Game.consoleModule.setupPlayers("Abdo", "Omar");
Game.consoleModule.playRound("00"); // O
Game.consoleModule.playRound("10"); // X
Game.consoleModule.playRound("01"); // O
Game.consoleModule.playRound("11"); // X
Game.consoleModule.playRound("02"); // O (Wins)

// --- VERTICAL WIN ---
console.log("TEST: Vertical Win");
Game.consoleModule.setupPlayers("Abdo", "Omar");
Game.consoleModule.playRound("00"); // O
Game.consoleModule.playRound("01"); // X
Game.consoleModule.playRound("10"); // O
Game.consoleModule.playRound("11"); // X
Game.consoleModule.playRound("20"); // O (Wins)

// --- DIAGONAL WIN ---
console.log("TEST: Diagonal Win");
Game.consoleModule.setupPlayers("Abdo", "Omar");
Game.consoleModule.playRound("00"); // O
Game.consoleModule.playRound("01"); // X
Game.consoleModule.playRound("11"); // O
Game.consoleModule.playRound("02"); // X
Game.consoleModule.playRound("22"); // O (Wins)

// --- TIE CASE ---
console.log("TEST: Tie Case");
Game.consoleModule.setupPlayers("Abdo", "Omar");
Game.consoleModule.playRound("00"); // O
Game.consoleModule.playRound("01"); // X
Game.consoleModule.playRound("02"); // O
Game.consoleModule.playRound("11"); // X
Game.consoleModule.playRound("10"); // O
Game.consoleModule.playRound("12"); // X
Game.consoleModule.playRound("21"); // O
Game.consoleModule.playRound("20"); // X
Game.consoleModule.playRound("22"); // O (Tie)
