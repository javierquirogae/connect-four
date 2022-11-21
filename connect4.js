/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const messageH2 = document.getElementById("Message");
const WIDTH = 7;
const HEIGHT = 6; 

let currPlayer = 1; // active player: 1 or 2
messageH2.innerText = `Red's turn !`
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
// TODO: set "board" to empty HEIGHT x WIDTH matrix array
function makeBoard() {
  for (let i = 0; i < HEIGHT; i++){
    board[i] = new Array(WIDTH);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  // this is the top row (with dashed pitlined cells)
  // the event listener is added to handle a click event
  // "tr" is TableRow Object
  const top = document.createElement("tr");
  // each row has its corrwsponding "id"
  top.setAttribute("id", `column-top-${currPlayer}`);
  top.addEventListener("click", handleClick);
  // this for loop adds the columns to the top row
  // "td" is TableData Object
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    // each clumn has its corresponding "id"
    headCell.setAttribute("id", x);
    // this is where the cells of the columns get appended to the top row
    top.append(headCell);
  }
  // this is where the top row gets appended tro the table 
  htmlBoard.append(top);

  // TODO: add comment for this code
  // nested loop that creates the main table where the chips will go
  // works like the loop above to create the rows but the outer loop iterates to create HEIGHT number of rows 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let y = HEIGHT-1; y > -1;y--){
    if (!board[y][x]){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let htmlCell = document.getElementById(`${y}-${x}`);
  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", `player_${currPlayer}_piece`);
  htmlCell.append(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  const highlightArray = highlight();
  for(let i = 0; i < 4; i++){
    let coordinates = highlightArray[i];
    console.log(coordinates);
    let htmlCell = document.getElementById(`${coordinates[0]}-${coordinates[1]}`);
    htmlCell.setAttribute("class", `winning_player_cell`);
  }


  for(let y = 0; y < HEIGHT; y++){
    for(let x = 0; x < WIDTH; x++){
      if(board[y][x] == null){
        let htmlCell = document.getElementById(`${y}-${x}`);
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "game_over");
        htmlCell.append(newDiv);
        board[y][x] = 300;
      }
    }
  }

  setTimeout(() => {window.alert(msg);}, 200);

}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  const columnTop = document.getElementById(`column-top-${currPlayer}`);
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return y;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;
  console.log(...board[y]);
  // check for win
  if (checkForWin()) {
    if(currPlayer===1){
      messageH2.innerText = `Red won !  [refresh to reset]`;
      return endGame("Red player won !  [refresh to reset]" );
    }
    else {
      messageH2.innerText = `Blue won !  [refresh to reset]`;
      return endGame("Blue player won!  [refresh to reset]");
    }
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkIfboardFilled()){
      messageH2.innerText = `Tie !!  [refresh to reset]`;
      return endGame("Tie !!  [refresh to reset]");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  if(currPlayer===1){
    messageH2.innerText = `Blue's turn !`;
    currPlayer = 2;
  } 
  else {
    currPlayer =1;
    messageH2.innerText = `Red's turn !`;
  }
  columnTop.setAttribute("id", `column-top-${currPlayer}`);
}

function checkIfboardFilled() {
  for(let y = 0; y < HEIGHT; y++){
    for(let x = 0; x < WIDTH; x++){
      if(board[y][x] == null){
       return false;
      }
    }
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}


function highlight(){
  function _win(cells) {
   
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      if (_win(horiz)){ 
        console.log(horiz);
        return horiz;
      }
      else if(_win(vert)){
        console.log(vert);
        return vert;
      }
      else if(_win(diagDR)){
        console.log(diagDR);
        return diagDR;
      }
      else if(_win(diagDL)){
        console.log(diagDL);
        return diagDL;
      }
    }
   
  }
}


makeBoard();
makeHtmlBoard();
