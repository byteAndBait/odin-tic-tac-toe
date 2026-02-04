
const ticTacToeGame = (() => {
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
/* 
first turn should be player one turn
you hit play round you have the player who played it
you want to say that the next is the other player


*/
  const GameController = ((playerOneName, playerTwoName) => {
    const board = GameBoard()
    const players = [Player(playerOneName, "O"), Player(playerTwoName, "X")]
    let activePlayer = players[0];



    const getBoard = () => board.getBoard()
    const mutateBoard = (pos) => {
      // for example pos=13, row one and column three
      board.getBoard()[pos[0]][pos[1]] = activePlayer.mark
    };
    const switchPlayerTurn = ()=>{
      activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }
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
      switchPlayerTurn()
      return {
        status: checkWinAndTie(),
        player: activePlayer
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
        if(currentBoard[0][0].length + currentBoard[1][1].length + currentBoard[2][2].length === 3){ //ensuring they are not empty
        return currentBoard[0][0];
        }
      }

      if (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0]) {
        if(currentBoard[0][2].length + currentBoard[1][1].length + currentBoard[2][0].length === 3){
        return currentBoard[0][2];
        }
      }
     
      for (let i = 0; i < 3 ; i++) {
        // horizontal
        if (currentBoard[i][0] === currentBoard[i][1] && currentBoard[i][1] === currentBoard[i][2]) {
          if(currentBoard[i][0].length + currentBoard[i][1].length + currentBoard[i][2].length === 3){
          return currentBoard[i][0];
          }
        }

        // vertical

        if (currentBoard[0][i] == currentBoard[1][i] && currentBoard[1][i] == currentBoard[2][i]) {
          if(currentBoard[0][i].length + currentBoard[1][i].length + currentBoard[2][i].length === 3){
          return currentBoard[0][i];
          }
        }
        // TIE

        
      }

      for(let i = 0 ; i< currentBoard.length ; i++){
        if ( // check if there is an empty cell remaining
          currentBoard[0][i].length == 0 ||
          currentBoard[1][i].length == 0 ||
          currentBoard[2][i].length == 0) {
          return;
        } else if (currentBoard[i] == currentBoard[2]) { // if it is the last row in the loop
          return "TIE";
        }
      }
    }
    return { playRound, resetBoard, getBoard };
  });




  return { GameController }
});

const consoleController = (() => {
  const Game = ticTacToeGame("Abdo", "Omar");
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


/*

get the names from the dialog
  get the IDs of the two inputs
  init the gamecontroller with the names


*/


const displayController = (() => {
  const dialog = document.querySelector(".players-names-dialog")
  dialog.showModal()
  const form = dialog.querySelector("#players-names-form");
  let statusElement = document.querySelector(".status");
  let gameElement = document.querySelector(".game")
  let game = ticTacToeGame().GameController("O","X");

  const formHandler = ()=>{
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let playerOneName = form.querySelector("#o-player-name").value
    let playerTwoName = form.querySelector("#x-player-name").value
    game =  ticTacToeGame().GameController(playerOneName,playerTwoName)
    statusElement.textContent =
     `Players configured:
        ${playerOneName} — (⭕)
        ${playerTwoName} — (❌)
        Player ${playerOneName}'s Turn ➡️
        `
    dialog.close()
    screenUpdate()
  })
  }
  formHandler()

  const screenUpdate = ()=>{
    if(document.querySelector(".layout")) { document.querySelector(".layout").remove() }
    let layout = document.createElement("div")
    layout.classList.add("layout")
    gameElement.appendChild(layout)
    let board = game.getBoard()
    for(let i = 0; i < 3; i++){
      let row = document.createElement("div")
      row.classList.add("row")
      layout.appendChild(row)
      for(let j = 0; j < 3; j++){
        let column = document.createElement("button");
        column.classList.add("column");
        column.textContent = board[i][j]
        column.dataset.position = `${i}${j}`
        row.appendChild(column)
      }
    }
    clickHandler()
  }

  const clickHandler = ()=>{
    document.querySelector(".layout").addEventListener("click", (event)=>{
      if(event.target.classList.contains("column")){
        let output = game.playRound(event.target.dataset.position)
          screenUpdate()
        if(output.status){
          let layout = document.querySelector(".layout");
          output.player.mark == "X" ? output.player.mark = "O" : output.player.mark = "X" // Get the previous player 
          output.status === "TIE" ? statusElement.textContent = "Game ended in a tie 🤝" : statusElement.textContent = `Player ${output.player.name} (${output.status}) has won 🎉`;
          layout.style.cursor = "not-allowed"
          layout.replaceWith(layout.cloneNode(true))
        }else{
          if(typeof output === "string"){
            statusElement.textContent = output
          }else{
            statusElement.textContent = `Player ${output.player.name}'s (${output.player.mark}) Turn ➡️`
          }
        }
        
      }
    })
    
  }
})

displayController()

// let consoleModule = consoleController()
// --- HORIZONTAL WIN ---
// consoleModule.playRound("00"); // O
// consoleModule.playRound("10"); // X
// consoleModule.playRound("01"); // O
// consoleModule.playRound("11"); // X
// consoleModule.playRound("02"); // O (Wins)

// // --- VERTICAL WIN ---
// console.log("TEST: Vertical Win");
// consoleModule.playRound("00"); // O
// consoleModule.playRound("01"); // X
// consoleModule.playRound("10"); // O
// consoleModule.playRound("11"); // X
// consoleModule.playRound("20"); // O (Wins)

// // --- DIAGONAL WIN ---
// console.log("TEST: Diagonal Win");
// consoleModule.playRound("00"); // O
// consoleModule.playRound("01"); // X
// consoleModule.playRound("11"); // O
// consoleModule.playRound("02"); // X
// consoleModule.playRound("22"); // O (Wins)

// // --- TIE CASE ---
// console.log("TEST: Tie Case");
// consoleModule.playRound("00"); // O
// consoleModule.playRound("01"); // X
// consoleModule.playRound("02"); // O
// consoleModule.playRound("11"); // X
// consoleModule.playRound("10"); // O
// consoleModule.playRound("12"); // X
// consoleModule.playRound("21"); // O
// consoleModule.playRound("20"); // X
// consoleModule.playRound("22"); // O (Tie)
