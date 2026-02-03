const ticTacToeGame = ((playerOneName,playerTwoName) => {
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
    const getBoard = () => board;
    return { resetBoard, getBoard };
  });
  
  const GameController = (() => {
    const board = GameBoard()
    const players = [Player(playerOneName, "O"), Player(playerTwoName, "X")]    
    let activePlayer = players[0];
    
      
//      `Players configured:
// ${players[0].name} — O (⭕)
// ${players[1].name} — X (❌)`
    
    const mutateBoard = (pos) => {
      // for example pos=13, row one and column three
      board.getBoard()[pos[0]][pos[1]] = activePlayer.mark
    };
    function playRound(pos) { // example: 21 : second row first column
      if (!(players[0].name || players[1].name)) {
        return "Players have not been configured. Please set player names. ⚠️"
      }
      let row = pos[0];
      let column = pos[1];
      if (board.getBoard()[row][column].length == 0) {
        mutateBoard(pos);
      } else {
        return "Cell is already occupied. Please select another cell. ❌"
      }

      return {
        status : checkWinAndTie(),
        player : activePlayer
      }
      
      
    }

    const resetBoard = () => {
      activePlayer = players[0];
      board.resetBoard()
    }
    
    function checkWinAndTie() {
      let currentBoard = board.getBoard();
      
      // Win State
      
      // diagonal
      
      if (currentBoard[0][0] == currentBoard[1][1] && currentBoard[1][1] == currentBoard[2][2]) {
        return currentBoard[0][0];
      }
      
      if (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0]) {
        return currentBoard[0][2];
      }
      
      for (i in currentBoard) {
        // horizontal
        if (currentBoard[i][0] === currentBoard[i][1] && currentBoard[i][1] === currentBoard[i][2]) {
          return currentBoard[i][0];
        }
        
        // vertical
        
        if (currentBoard[0][i] == currentBoard[1][i] && currentBoard[1][i] == currentBoard[2][i]) {
          return currentBoard[0][i];
        }
        
        // TIE
        
        if ( // check if there is an empty cell remaining
          currentBoard[0][i].length == 0 ||
          currentBoard[1][i].length == 0 ||
          currentBoard[2][i].length == 0)
        {
          return;
        } else if (currentBoard[i] == currentBoard[2]) { // if it is the last row in the loop
          return "TIE";
        }
      }
    }
    return { playRound, resetBoard};
  })();
  
 

  // const uiModule = (()=>{
  //   let dialog = document.querySelector(".players-names-dialog")
  //   dialog.showModal()
  // })()
  return {GameController}
});

 const consoleController = (() => {
  const Game = ticTacToeGame("Abdo","Omar");
    let playRound = (pos) => {
      let output = Game.GameController.playRound(pos)
      console.log(`Player ${output.player.name} (${output.player.mark}) moved to position ${pos[0]},${pos[1]} ➡️`)
      if (output.status) {
        let result = output.status == "TIE" ? "Game ended in a tie 🤝" : `Player ${output.player.name} (${output.status}) has won 🎉`
        console.log(result)
        resetBoard()
      }
    }
    
    let resetBoard = () => {
      Game.GameController.resetBoard()
      console.log("Board has been reset ✅")
    }
    return { playRound, resetBoard };
  })


let consoleModule = consoleController()
// --- HORIZONTAL WIN ---
consoleModule.playRound("00"); // O
consoleModule.playRound("10"); // X
consoleModule.playRound("01"); // O
consoleModule.playRound("11"); // X
consoleModule.playRound("02"); // O (Wins)

// --- VERTICAL WIN ---
console.log("TEST: Vertical Win");
consoleModule.playRound("00"); // O
consoleModule.playRound("01"); // X
consoleModule.playRound("10"); // O
consoleModule.playRound("11"); // X
consoleModule.playRound("20"); // O (Wins)

// --- DIAGONAL WIN ---
console.log("TEST: Diagonal Win");
consoleModule.playRound("00"); // O
consoleModule.playRound("01"); // X
consoleModule.playRound("11"); // O
consoleModule.playRound("02"); // X
consoleModule.playRound("22"); // O (Wins)

// --- TIE CASE ---
console.log("TEST: Tie Case");
consoleModule.playRound("00"); // O
consoleModule.playRound("01"); // X
consoleModule.playRound("02"); // O
consoleModule.playRound("11"); // X
consoleModule.playRound("10"); // O
consoleModule.playRound("12"); // X
consoleModule.playRound("21"); // O
consoleModule.playRound("20"); // X
consoleModule.playRound("22"); // O (Tie)
