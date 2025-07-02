const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

// Game objects
let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 40,
    height: 60,
    speed: 5,
    color: '#4CAF50'
};

let bullets = [];
let enemies = [];
let score = 0;
let gameLoop;
let enemySpawnRate = 60;
let frameCount = 0;

// Controls
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

document.addEventListener('keydown', (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
    }
});

function drawPlayer() {
    // Draw body
    ctx.fillStyle = '#3498db';
    ctx.fillRect(player.x + 12, player.y + 20, 16, 25); // torso

    // Draw head
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(player.x + 20, player.y + 12, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw legs
    ctx.fillStyle = '#3498db';
    ctx.fillRect(player.x + 12, player.y + 45, 6, 15); // left leg
    ctx.fillRect(player.x + 22, player.y + 45, 6, 15); // right leg

    // Draw arms
    ctx.fillRect(player.x + 2, player.y + 25, 10, 6); // left arm
    ctx.fillRect(player.x + 28, player.y + 25, 10, 6); // right arm

    // Draw gun
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(player.x + 32, player.y + 22, 15, 4); // gun barrel
}

function drawBullets() {
    bullets.forEach(bullet => {
        // Draw bullet with gradient effect
        const gradient = ctx.createLinearGradient(bullet.x, bullet.y, bullet.x, bullet.y + bullet.height);
        gradient.addColorStop(0, '#ff0');
        gradient.addColorStop(0.5, '#f00');
        gradient.addColorStop(1, '#ff0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Add glow effect
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 10;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Draw alien body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
        ctx.fill();

        // Draw alien eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/3, enemy.y + enemy.height/3, 5, 0, Math.PI * 2);
        ctx.arc(enemy.x + (enemy.width/3 * 2), enemy.y + enemy.height/3, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw alien pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/3, enemy.y + enemy.height/3, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + (enemy.width/3 * 2), enemy.y + enemy.height/3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw alien mouth
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 8, 0, Math.PI);
        ctx.stroke();
    });
}

function movePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function moveBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y + bullet.height > 0;
    });
}

function moveEnemies() {
    enemies = enemies.filter(enemy => {
        enemy.y += enemy.speed;
        return enemy.y < canvas.height;
    });
}

function spawnEnemy() {
    if (frameCount % enemySpawnRate === 0) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 2
        });
    }
}

function shoot() {
    if (keys.Space && frameCount % 15 === 0) {
        bullets.push({
            x: player.x + 45,
            y: player.y + 22,
            width: 4,
            height: 10,
            speed: 7
        });
    }
}

function checkCollisions() {
    // Check bullet-enemy collisions
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
            }
        });
    });

    // Check player-enemy collisions
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            gameOver();
        }
    });
}

function gameStep() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    shoot();
    moveBullets();
    moveEnemies();
    spawnEnemy();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();

    frameCount++;

    // Increase difficulty
    if (frameCount % 1000 === 0 && enemySpawnRate > 30) {
        enemySpawnRate -= 5;
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
}

function restartGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
    bullets = [];
    enemies = [];
    score = 0;
    frameCount = 0;
    enemySpawnRate = 60;
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';
    clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, 1000 / 60);
}

// Start the game
gameLoop = setInterval(gameStep, 1000 / 60);