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
    const resetBoard = ()=> {
      board.forEach((e)=>{e[0] = e[1] = e[2] = ""});
      console.log(`New Board ${board}`)
    };

    const mutateBoard = (pos, mark) => {
      // for example pos=13, row one and column three
      
      board[pos[0]][pos[1]] = mark
    };

    const getBoard = () => board;
    return { resetBoard,mutateBoard, getBoard };
  })();

  const GameController = ((firstName, secondName) => {
    const players = [Player(firstName, 1), Player(secondName, 0)];
    let lastTurnPlayer;

    function playRound(pos) {
      lastTurnPlayer = lastTurnPlayer == players[0] ? players[1] : players[0];
      let row = pos[0];
      let column = pos[1];
      if(GameBoard.getBoard()[row][column].length == 0){
        GameBoard.mutateBoard(pos, lastTurnPlayer.mark);
      }else{
        return
      }
      checkWinAndTie() ? console.log(checkWinAndTie()) : false;
    }
    let resetBoard = ()=>{
      GameBoard.resetBoard()
      lastTurnPlayer = undefined;
    }
    function checkWinAndTie() {
      let board = GameBoard.getBoard();

      // Win State

      // diagonal
      if (board[0][0] + board[1][1] + board[2][2] === 3) {
        return "O WON";
      }else if (board[0][0] + board[1][1] + board[2][2] === 0) {
        return "X WON";
      }

      if (board[0][2] + board[1][1] + board[2][0] === 3) {
        return "O WON";
      }else if (board[0][2] + board[1][1] + board[2][0] === 0) {
        return "X WON";
      }

      for (i in board) {
        // horizontal
        if (board[i][0] + board[i][1] + board[i][2] === 3) {
          return "O WON";
        }else if (board[i][0] + board[i][1] + board[i][2] === 0) {
          return "X WON";
        }

        // vertical

        if (board[0][i] + board[1][i] + board[2][i] === 3) {
          return "O WON";
        }else if (board[0][i] + board[1][i] + board[2][i] === 0) {
          return "X WON";
        }

        // TIE

        if (
          board[i][0].length == 0 ||
          board[i][0].length == 0 ||
          board[i][0].length == 0
        ) {
          return;
        } else if (board[i] == board[2]) { // if it is the last row
            return "TIE";
        }
      }

    }
    return { playRound , resetBoard };
  })("Abdo", "byte");
  return { GameController };
})();

// =================== TESTS ===================

// Reset before starting
console.log("TEST 0: Resetting Board");
Game.GameController.resetBoard();

// Helper to print board
const showBoard = () => console.table(Game.GameController.resetBoard ? Game.GameController.resetBoard : Game.GameController.getBoard);

// --- TEST 1: O wins diagonally (0,0)(1,1)(2,2)
console.log("TEST 1: O wins diagonally ↘");
Game.GameController.resetBoard();
Game.GameController.playRound([0,0]); // O
Game.GameController.playRound([0,1]); // X
Game.GameController.playRound([1,1]); // O
Game.GameController.playRound([0,2]); // X
Game.GameController.playRound([2,2]); // O
console.log(Game.GameController);

// --- TEST 2: X wins diagonally (0,2)(1,1)(2,0)
console.log("TEST 2: X wins diagonally ↙");
Game.GameController.resetBoard();
Game.GameController.playRound([0,1]); // O
Game.GameController.playRound([0,2]); // X
Game.GameController.playRound([1,2]); // O
Game.GameController.playRound([1,1]); // X
Game.GameController.playRound([2,1]); // O
Game.GameController.playRound([2,0]); // X
console.log(Game.GameController);

// --- TEST 3: O wins horizontally (first row)
console.log("TEST 3: O wins horizontally first row");
Game.GameController.resetBoard();
Game.GameController.playRound([0,0]); // O
Game.GameController.playRound([1,0]); // X
Game.GameController.playRound([0,1]); // O
Game.GameController.playRound([1,1]); // X
Game.GameController.playRound([0,2]); // O
console.log(Game.GameController);

// --- TEST 4: X wins vertically (first column)
console.log("TEST 4: X wins vertically first column");
Game.GameController.resetBoard();
Game.GameController.playRound([0,1]); // O
Game.GameController.playRound([0,0]); // X
Game.GameController.playRound([1,1]); // O
Game.GameController.playRound([1,0]); // X
Game.GameController.playRound([2,2]); // O
Game.GameController.playRound([2,0]); // X
console.log(Game.GameController);

// --- TEST 5: TIE situation
console.log("TEST 5: TIE");
Game.GameController.resetBoard();
Game.GameController.playRound([0,0]); // O
Game.GameController.playRound([0,1]); // X
Game.GameController.playRound([0,2]); // O
Game.GameController.playRound([1,1]); // X
Game.GameController.playRound([1,0]); // O
Game.GameController.playRound([1,2]); // X
Game.GameController.playRound([2,1]); // O
Game.GameController.playRound([2,0]); // X
Game.GameController.playRound([2,2]); // O
console.log(Game.GameController);

// --- TEST 6: Trying to play on occupied cell
console.log("TEST 6: Occupied cell");
Game.GameController.resetBoard();
Game.GameController.playRound([0,0]); // O
Game.GameController.playRound([0,0]); // X tries same cell
console.log("Should ignore second move");

// --- TEST 7: Alternating turns check
console.log("TEST 7: Turn alternation");
Game.GameController.resetBoard();
Game.GameController.playRound([1,1]); // O
Game.GameController.playRound([2,2]); // X
Game.GameController.playRound([1,2]); // O
console.log("Turn switching works if no overlap or early stop");

console.log("=== END OF TESTS ===");