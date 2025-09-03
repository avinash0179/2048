var board;
var score = 0;
var rows = 4;
var columns = 4;
window.onload = function () {
  setGame();
  let boardElement = document.getElementById("board");

  function setGame() {
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        let tile = document.createElement("div");
        tile.id = r.toString() + "-" + c.toString();
        tile.classList.add("tile");
        document.getElementById("board").append(tile);
      }
    }
    setTwo();
  }

  function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
      tile.innerText = num.toString();
      if (num <= 4096) {
        tile.classList.add("x" + num.toString());
      } else {
        tile.classList.add("x8192");
      }
    }
  }

  document.addEventListener("keyup", (e) => {
    let moved = false;
    if (e.code == "ArrowLeft") moved = slideLeft();
    else if (e.code == "ArrowRight") moved = slideRight();
    else if (e.code == "ArrowUp") moved = slideUp();
    else if (e.code == "ArrowDown") moved = slideDown();
    if (moved) {
      setTwo();
      document.getElementById("score").innerText = score;
      isGameOver();
    }
  });

  let startX, startY, endX, endY;
  document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  boardElement.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener("touchend", function (e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
  });

  function handleSwipe() {
    let diffX = endX - startX;
    let diffY = endY - startY;
    let moved = false;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 30) moved = slideRight();
      else if (diffX < -30) moved = slideLeft();
    } else {
      if (diffY > 30) moved = slideDown();
      else if (diffY < -30) moved = slideUp();
    }
    if (moved) {
      setTwo();
      document.getElementById("score").innerText = score;
      isGameOver();
    }
  }

  function filterZero(row) {
    return row.filter((num) => num != 0);
  }

  function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] == row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        score += row[i];
      }
    }
    row = filterZero(row);
    while (row.length < columns) {
      row.push(0);
    }
    return row;
  }

  function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
      let row = board[r];
      let original = [...row];
      row = slide(row);
      board[r] = row;
      if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
      for (let c = 0; c < columns; c++) {
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];
        updateTile(tile, num);
      }
    }
    return moved;
  }

  function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
      let row = board[r];
      let original = [...row];
      row.reverse();
      row = slide(row);
      row.reverse();
      board[r] = row;
      if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
      for (let c = 0; c < columns; c++) {
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];
        updateTile(tile, num);
      }
    }
    return moved;
  }

  function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
      let original = [...row];
      row = slide(row);
      for (let r = 0; r < rows; r++) {
        board[r][c] = row[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];
        updateTile(tile, num);
      }
      if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
    }
    return moved;
  }

  function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
      let original = [...row];
      row.reverse();
      row = slide(row);
      row.reverse();
      for (let r = 0; r < rows; r++) {
        board[r][c] = row[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];
        updateTile(tile, num);
      }
      if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
    }
    return moved;
  }

  function setTwo() {
    if (!hasEmptyTile()) {
      return;
    }
    let found = false;
    while (!found) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * columns);
      if (board[r][c] == 0) {
        board[r][c] = 2;
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        tile.innerText = "2";
        tile.classList.add("x2");
        found = true;
      }
    }
  }

  function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (board[r][c] == 0) {
          return true;
        }
      }
    }
    return false;
  }

  function isGameOver() {
    if (hasEmptyTile()) return false;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns - 1; j++) {
        if (board[i][j] === board[i][j + 1]) {
          return false;
        }
      }
    }
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < columns; j++) {
        if (board[i][j] === board[i + 1][j]) {
          return false;
        }
      }
    }
    document.querySelector(".gameover").style.display = "flex";
    return true;
  }

  function restartGame() {
    document.getElementById("score").innerText = "0";
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    score = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        updateTile(tile, board[r][c]);
      }
    }
    setTwo();
  }
    document.getElementById("reb").addEventListener("click", () => {
      document.querySelector(".gameover").style.display = "none";
      restartGame();
    });
};

