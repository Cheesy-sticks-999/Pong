const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 8;
const playerSpeed = 5;
const canvasWidth = canvas.width, canvasHeight = canvas.height;

let aiSpeed = 3; // Default difficulty
let gameRunning = false; // Game state
let gameOver = false; // Game over state

// Player paddles and ball
const player = { x: 0, y: canvasHeight / 2 - paddleHeight / 2, score: 0 };
const ai = { x: canvasWidth - paddleWidth, y: canvasHeight / 2 - paddleHeight / 2, score: 0 };
const ball = { x: canvasWidth / 2, y: canvasHeight / 2, dx: 4, dy: 4 };

// Track key states
const keys = { ArrowUp: false, ArrowDown: false };

// Utility functions
function drawRect(x, y, w, h, color = 'white') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = 'white') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color = 'white', fontSize = '30px') {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} Arial`;
    ctx.fillText(text, x, y);
}

// Reset the ball
function resetBall() {
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.dx *= -1; // Change direction
}

// Reset the game
function resetGame() {
    player.score = 0;
    ai.score = 0;
    resetBall();
    gameOver = false;
    gameRunning = true;
}

// Start screen
function drawStartScreen() {
    drawRect(0, 0, canvasWidth, canvasHeight, 'black');
    drawText('PONG GAME', canvasWidth / 2 - 100, canvasHeight / 2 - 50, 'white', '40px');
    drawText('Choose Difficulty:', canvasWidth / 2 - 140, canvasHeight / 2, 'white', '30px');
    drawText('1. Easy', canvasWidth / 2 - 60, canvasHeight / 2 + 40, 'white');
    drawText('2. Medium', canvasWidth / 2 - 80, canvasHeight / 2 + 80, 'white');
    drawText('3. Hard', canvasWidth / 2 - 60, canvasHeight / 2 + 120, 'white');
}

// Game over screen
function drawGameOverScreen(winner) {
    drawRect(0, 0, canvasWidth, canvasHeight, 'black');
    drawText(`${winner} Wins!`, canvasWidth / 2 - 100, canvasHeight / 2 - 50, 'white', '40px');
    drawText('Press Enter to Restart', canvasWidth / 2 - 150, canvasHeight / 2, 'white', '30px');
}

// Move AI
function moveAI() {
    if (ai.y + paddleHeight / 2 < ball.y) ai.y += aiSpeed;
    else if (ai.y + paddleHeight / 2 > ball.y) ai.y -= aiSpeed;
}

// Move player based on key state
function movePlayer() {
    if (keys.ArrowUp && player.y > 0) player.y -= playerSpeed;
    if (keys.ArrowDown && player.y < canvasHeight - paddleHeight) player.y += playerSpeed;
}

// Update game logic
function update() {
    if (gameOver) return;

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y < ballRadius || ball.y > canvasHeight - ballRadius) ball.dy *= -1;

    // Ball collision with paddles
    if (
        (ball.x - ballRadius < player.x + paddleWidth &&
            ball.y > player.y &&
            ball.y < player.y + paddleHeight) ||
        (ball.x + ballRadius > ai.x &&
            ball.y > ai.y &&
            ball.y < ai.y + paddleHeight)
    ) {
        ball.dx *= -1;
    }

    // Ball out of bounds
    if (ball.x < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x > canvasWidth) {
        player.score++;
        resetBall();
    }

    // Check for game over
    if (player.score >= 10 || ai.score >= 10) {
        gameOver = true;
        gameRunning = false;
    }

    // Move paddles
    movePlayer();
    moveAI();
}

// Render game elements
function render() {
    // Clear the canvas
    drawRect(0, 0, canvasWidth, canvasHeight, 'black');

    // Draw paddles and ball
    drawRect(player.x, player.y, paddleWidth, paddleHeight);
    drawRect(ai.x, ai.y, paddleWidth, paddleHeight);
    drawCircle(ball.x, ball.y, ballRadius);

    // Draw scores
    drawText(player.score, canvasWidth / 4, 50);
    drawText(ai.score, (3 * canvasWidth) / 4, 50);
}

function gameLoop() {
    if (!gameRunning) {
        if (gameOver) {
            const winner = player.score >= 10 ? 'Player' : 'AI';
            drawGameOverScreen(winner);
        } else {
            drawStartScreen();
        }
    } else {
        update();
        render();
    }
    requestAnimationFrame(gameLoop);
}

// Event listeners for smooth movement
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;

    // Start game with difficulty selection
    if (!gameRunning && !gameOver) {
        if (event.key === '1') {
            aiSpeed = 2; // Easy
            gameRunning = true;
        } else if (event.key === '2') {
            aiSpeed = 4; // Medium
            gameRunning = true;
        } else if (event.key === '3') {
            aiSpeed = 6; // Hard
            gameRunning = true;
        }
    }

    // Restart game after game over
    if (gameOver && event.key === 'Enter') {
        resetGame();
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Start the game loop
gameLoop();
