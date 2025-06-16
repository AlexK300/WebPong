// script.js
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game elements
const paddleWidth = 15;
const paddleHeight = 100;
const ballSize = 15;
const aiSpeed = 6;

// Player paddle
const player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#00ffff',
    score: 0
};

// AI paddle
const ai = {
    x: canvas.width - paddleWidth - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#ff00ff',
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#ffffff'
};

// Draw rectangles (paddles)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
}

// Draw circle (ball)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
}

// Draw text
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '35px Arial';
    ctx.fillText(text, x, y);
}

// Draw center line
function drawNet() {
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#444');
    }
}

// Move player paddle with mouse
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.y = e.clientY - rect.top - player.height / 2;

    // Keep paddle on screen
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
});

// Ball reset
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// Collision detection
function collision(b, p) {
    return b.x + b.size > p.x &&
    b.x < p.x + p.width &&
    b.y + b.size > p.y &&
    b.y < p.y + p.height;
}

// AI movement
function aiMove() {
    const aiPaddleCenter = ai.y + ai.height / 2;
    const ballCenter = ball.y + ball.size / 2;

    // Simple AI with prediction error
    const predictError = Math.random() * 30 - 15;
    const targetPos = ballCenter - ai.height / 2 + predictError;

    if (aiPaddleCenter < targetPos) ai.y += aiSpeed;
    if (aiPaddleCenter > targetPos) ai.y -= aiSpeed;

    // Keep AI paddle on screen
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) {
        ai.y = canvas.height - ai.height;
    }
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Top/bottom wall collision
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Paddle collision
    const paddle = ball.x < canvas.width / 2 ? player : ai;
    if (collision(ball, paddle)) {
        // Calculate bounce angle
        const hitPoint = (ball.y - (paddle.y + paddle.height / 2));
        const normalizedHitPoint = hitPoint / (paddle.height / 2);
        const bounceAngle = normalizedHitPoint * (Math.PI / 4);

        // Determine direction
        const direction = ball.x < canvas.width / 2 ? 1 : -1;

        // Update ball velocity
        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);
        ball.velocityY = ball.speed * Math.sin(bounceAngle);

        // Increase speed
        ball.speed += 0.5;
    }

    // Score points
    if (ball.x < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x > canvas.width) {
        player.score++;
        resetBall();
    }

    // Move AI
    aiMove();
}

// Render game
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.size, ball.color);
    drawText(player.score, canvas.width / 4, 50, '#00ffff');
    drawText(ai.score, 3 * canvas.width / 4, 50, '#ff00ff');
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();
