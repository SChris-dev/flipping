// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

// game variables

// timer
let countdown = 3;
let countdownInterval;

function countdownStart() {
    countdownScreen.style.display = 'flex';
    countdown = 3;
    countdownText.innerHTML = countdown;
    countdownInterval = setInterval(() => {
        countdown--;
        countdownText.innerHTML = countdown;

        if (countdown <= 0) {
            countdownScreen.classList.add('dissapear');
            clearInterval(countdownInterval);
        }
    }, 1000);
}

// grid
const rows = 8;
const cols = 8;
const cellSize = canvas.width / 8;

// board (1 = black, 2 = white)
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

function initializeBoard() {
    board[3][3] = 2;
    board[3][4] = 1;
    board[4][3] = 1;
    board[4][4] = 2;
}

// board grid
function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            const offsetGridSize = cellSize - 10;

            ctx.fillStyle = 'green';
            ctx.fillRect(row * cellSize + 5, col * cellSize + 5, offsetGridSize, offsetGridSize);
        }
    }
}

// discs
function drawDiscs() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1 || board[row][col] === 2) {
                ctx.beginPath();
                ctx.arc(
                    col * cellSize + cellSize / 2,
                    row * cellSize + cellSize / 2,
                    25,
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = board[row][col] === 1 ? 'black' : 'white';
                ctx.fill();
            }
        }
    }
}

// legal move check
const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // vertical & horizontal
    [-1, -1], [-1, 1], [1, -1], [1, 1]  // diagonals
];

function isValidMove(row, col, player) {
    if (board[row][col] !== 0) return false;

    let opponent = player === 1 ? 2 : 1;
    let valid = false;

    for (let [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        let foundOpponent = false;

        while (r >= 0 && r < rows && c >= 0 && c < cols) {
            if (board[r][c] === opponent) {
                foundOpponent = true;
            } else if (board[r][c] === player) {
                if (foundOpponent) valid = true;
                break;
            } else { 
                break;
            }
            r += dr;
            c += dc;
        }
    }
    return valid;
}

function highlightValidMoves(player) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (isValidMove(row, col, player)) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.arc(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, 25, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

// flipping mechanics
function flipDiscs(row, col, player) {
    const opponent = player === 1 ? 2 : 1;

    for (let [dx, dy] of directions) {
        let r = row + dx;
        let c = col + dy;
        let flipList = [];

        while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === opponent) {
            flipList.push([r, c]);
            r += dx;
            c += dy;
        }

        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
            for (let [fr, fc] of flipList) {
                board[fr][fc] = player;
            }
        }
    }
}

// place disc

function placeDisc(row, col, player) {
    if (isValidMove(row, col, player)) {
        board[row][col] = player;
        flipDiscs(row, col, player);
        checkGameOver();
    }
}

// AI (Computer) Turn

let currentPlayer = 1;
let aiColor;

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (currentPlayer === aiColor) {
        setTimeout(aiMove, 1000);
    }
}

function aiMove() {
    if (currentPlayer !== aiColor) return;
    let validMoves = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (isValidMove(row, col, aiColor)) {
                validMoves.push({row, col});
            }
        }
    }

    if (validMoves.length > 0) {
        let move = validMoves[Math.floor(Math.random() * validMoves.length)];
        placeDisc(move.row, move.col, aiColor);
        switchTurn();
    }
}

// draw score
function drawScore () {
    let blackCount = 0;
    let whiteCount = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1) blackCount++;
            if (board[row][col] === 2) whiteCount++;
        }
    }

    whiteDiscCountText.innerHTML = whiteCount;
    blackDiscCountText.innerHTML = blackCount;
}

// draw background
function drawBackground() {
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// event listeners

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (currentPlayer === playerColor && isValidMove(row, col, playerColor)) {
        placeDisc(row, col, playerColor);
        switchTurn();
    }
})

// check game over
function checkGameOver() {
    let blackMoves = 0;
    let whiteMoves = 0;
    let emptyCells = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 0) emptyCells++;
            if (isValidMove(row, col, 1)) blackMoves++;
            if (isValidMove(row, col, 2)) whiteMoves++;
        }
    }

    if (emptyCells === 0 || (blackMoves === 0 && whiteMoves === 0)) {
        gameOver();
    }
}

function gameOver() {
    let blackCount = 0;
    let whiteCount = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1) blackCount++;
            if (board[row][col] === 2) whiteCount++;
        }
    }

    let winner = blackCount > whiteCount ? 'Black Wins!' : whiteCount > blackCount ? 'White Wins!' : 'Draw!';

    gameOverText.innerHTML = winner;
    gameOverScreen.style.display = 'flex';

    let playerName = usernameInput.value.trim();

    saveScore(playerName, blackCount, whiteCount);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawGrid();
    highlightValidMoves(currentPlayer);
    drawDiscs();
    drawScore();

    requestAnimationFrame(gameLoop);
}

function gameStart() {
    aiColor = playerColor === 1 ? 2 : 1;
    currentPlayer = 1;

    countdownStart();
    initializeBoard();
    gameLoop();

    if (aiColor === 1) {
        setTimeout(aiMove, 3000);
    }
}

function saveScore(playerName, blackCount, whiteCount) {
    let playerScore = (playerColor === 1) ? blackCount : whiteCount;

    let highScoreData = JSON.parse(localStorage.getItem('highScoreData')) || { name: "None", score: 0 };

    if (playerScore > highScoreData.score) {
        let newHighScore = { name: playerName, score: playerScore };
        localStorage.setItem('highScoreData', JSON.stringify(newHighScore));
    }
}