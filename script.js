
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

  const GameController = ((playerOneName, playerTwoName) => {
    const board = GameBoard()
    const players = [Player(playerOneName, "O"), Player(playerTwoName, "X")]
    let activePlayer = players[0];

    const getBoard = () => board.getBoard()
    const mutateBoard = (pos) => {
      // for example pos=13, row one and column three
      board.getBoard()[pos[0]][pos[1]] = activePlayer.mark
    };
    const switchTurns = ()=>{
      activePlayer = activePlayer == players[0] ? players[1] : players[0];
      
    }
    function playRound(pos) {
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
      switchTurns(  )
      return {
        status: checkWinAndTie(),
        activePlayer: activePlayer,
        previousPlayer: activePlayer == players[0] ? players[1] : players[0]
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

const displayController = (() => {
  const dialog = document.querySelector(".playersNamesDialog")
  dialog.showModal()
  const form = dialog.querySelector("#playersNamesForm");
  let statusElement = document.querySelector(".status");
  let gameElement = document.querySelector(".game");
  let playerOneName,playerTwoName,game;

  document.querySelector(".resetButton").addEventListener("click",()=>{
    game.resetBoard()
    screenUpdate()
    statusElement.textContent =
     `${playerOneName}'s Turn ➡️ `
  })
  const formHandler = ()=>{ 
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    playerOneName = form.querySelector("#oPlayerName").value
    playerTwoName = form.querySelector("#xPlayerName").value
    game =  ticTacToeGame().GameController(playerOneName,playerTwoName)
    statusElement.textContent =
     `${playerOneName}'s Turn ➡️ `
    dialog.close()
    screenUpdate() // Initilization
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
          output.status === "TIE" ? statusElement.textContent = "Game ended in a tie 🤝" : statusElement.textContent = `Player ${output.previousPlayer.name} (${output.status}) has won 🎉`;
          layout.style.cursor = "not-allowed"
          layout.replaceWith(layout.cloneNode(true))
        }else{
          if(typeof output === "string"){
            statusElement.textContent = output
          }else{
            statusElement.textContent = `Player ${output.activePlayer.name}'s (${output.activePlayer.mark}) Turn ➡️`
          }
        }
        
      }
    })
    
  }
})

displayController()