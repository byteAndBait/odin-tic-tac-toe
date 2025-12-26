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
      console.log(`New Board ${board}`)
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
    function setupPlayers(firstName,secondName){
      players = [Player(firstName, "O"), Player(secondName, "X")]
    }
    function playRound(pos) { // example: 21 : second row first column
    if(!(players[0].name || players[1].name)){
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
      if(checkWinAndTie()){
        let result = checkWinAndTie() == "TIE" ? "TIE" : `${checkWinAndTie()} Has Won`
        resetBoard();
        return result;
      }
    }
    let resetBoard = () => {
      GameBoard.resetBoard()
      lastTurnPlayer = undefined;
    }
    
    function checkWinAndTie() {
      let board = GameBoard.getBoard();
      
      // Win State
      
      // diagonal
      if (board[0][0] === board[1][1] === board[2][2]) {
        return board[0][0];
      }
      
      if (board[0][2] === board[1][1] === board[2][0]) {
        return board[0][2];
      }
      
      for (i in board) {
        // horizontal
        if (board[i][0] === board[i][1] === board[i][2]) {
          return board[i][0];
        }
        
        // vertical
        
        if (board[0][i] + board[1][i] + board[2][i] === 3) {
          return board[0][i];
        }
        
        // TIE
        
        if ( // check if there is an empty cell remaining
          board[0][i].length == 0 ||
          board[1][i].length == 0 ||
          board[3][i].length == 0)
        {
          return;
        } else if (board[i] == board[2]) { // if it is the last row in the loop
          return "TIE";
        }
      }
    }
    return { playRound, resetBoard, setupPlayers };
  })();
  return { GameController };
})();
