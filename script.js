/*
Project: Tic-Tac-Toe
User Story:
    - able to play the game using DOM or function in console
    - turns must be switched automatically
    - win and tie 

*/
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
      let row = pos[0];
      let column = pos[1];
      if (board[row][column].length == 0) {
        board[row][column] = mark;
      } else {
        console.log("The current cell is already filled");
        return;
      }
    };

    const getBoard = () => board;
    return { resetBoard,mutateBoard, getBoard };
  })();

  const GameController = ((firstName, secondName) => {
    const players = [Player(firstName, 1), Player(secondName, 0)];
    let lastTurnPlayer;

    function playRound(pos) {
      lastTurnPlayer = lastTurnPlayer == players[0] ? players[1] : players[0];
      GameBoard.mutateBoard(pos, lastTurnPlayer.mark);
      // console.log(GameBoard.getBoard());
      if (checkWinAndTie()) {
        console.log(checkWinAndTie());
      }
    }
    let resetBoard = GameBoard.resetBoard
    function checkWinAndTie() {
      let board = GameBoard.getBoard();

      // Win State

      // diagonal
      if (board[0][0] + board[1][1] + board[2][2] === 3) {
        return "O WON";
      }

      if (board[0][0] + board[1][1] + board[2][2] === 0) {
        return "X WON";
      }

      if (board[0][2] + board[1][1] + board[2][0] === 3) {
        return "O WON";
      }

      if (board[0][2] + board[1][1] + board[2][0] === 0) {
        return "X WON";
      }

      for (i in board) {
        // horizontal
        if (board[i][0] + board[i][1] + board[i][2] === 3) {
          return "O WON";
        }
        if (board[i][0] + board[i][1] + board[i][2] === 0) {
          return "X WON";
        }

        // vertical

        if (board[0][i] + board[1][i] + board[2][i] === 3) {
          return "O WON";
        }

        if (board[0][i] + board[1][i] + board[2][i] === 0) {
          return "X WON";
        }

        // TIE

        if (
          board[i][0].length == 0 ||
          board[i][0].length == 0 ||
          board[i][0].length == 0
        ) {
          return 0;
        } else {
          // if it is the last row
          if (board[i] == board[2]) {
            return "TIE";
          }
        }
      }
    }
    return { playRound , resetBoard };
  })("Abdo", "byte");
  return { GameController };
})();

