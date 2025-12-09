const boardEl = document.querySelector('.board');
const statusText = document.getElementById('status-text');
const resetRoundBtn = document.getElementById('reset-round');
const resetGameBtn = document.getElementById('reset-game');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const score = {
  X: 0,
  O: 0,
  draw: 0
};

let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let isRoundOver = false;

init();

function init() {
  createCells();
  attachListeners();
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function createCells() {
  boardEl.innerHTML = '';

  for (let i = 0; i < 9; i += 1) {
    const cellButton = document.createElement('button');
    cellButton.className = 'cell';
    cellButton.type = 'button';
    cellButton.dataset.index = i;
    cellButton.setAttribute('aria-label', `Cell ${i + 1}, empty`);
    cellButton.setAttribute('role', 'gridcell');
    cellButton.addEventListener('click', handleMove);
    boardEl.appendChild(cellButton);
  }
}

function attachListeners() {
  resetRoundBtn.addEventListener('click', resetRound);
  resetGameBtn.addEventListener('click', resetGame);
}

function handleMove(event) {
  if (isRoundOver) {
    return;
  }

  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (boardState[index]) {
    return;
  }

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.disabled = true;
  cell.setAttribute('aria-label', `Cell ${index + 1}, ${currentPlayer}`);

  const winnerInfo = evaluateBoard();

  if (winnerInfo.winner) {
    handleWin(winnerInfo);
    return;
  }

  if (winnerInfo.isDraw) {
    handleDraw();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function evaluateBoard() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return { winner: boardState[a], combo };
    }
  }

  const isDraw = boardState.every((cell) => cell !== null);
  return { winner: null, combo: null, isDraw };
}

function handleWin({ winner, combo }) {
  isRoundOver = true;
  score[winner] += 1;
  updateScoreboard();
  updateStatus(`Player ${winner} wins!`);
  highlightCombo(combo);
  disableRemainingCells();
}

function handleDraw() {
  isRoundOver = true;
  score.draw += 1;
  updateScoreboard();
  updateStatus('Round ended in a draw.');
}

function highlightCombo(combo) {
  combo.forEach((index) => {
    const cell = boardEl.querySelector(`.cell[data-index="${index}"]`);
    if (cell) {
      cell.classList.add('cell--win');
    }
  });
}

function disableRemainingCells() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.disabled = true;
  });
}

function resetRound() {
  boardState = Array(9).fill(null);
  isRoundOver = false;
  currentPlayer = 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
  boardEl.innerHTML = '';
  createCells();
}

function resetGame() {
  score.X = 0;
  score.O = 0;
  score.draw = 0;
  updateScoreboard();
  resetRound();
}

function updateScoreboard() {
  scoreXEl.textContent = score.X;
  scoreOEl.textContent = score.O;
  scoreDrawEl.textContent = score.draw;
}

function updateStatus(message) {
  statusText.textContent = message;
}
