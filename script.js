class DinoGame {
    constructor() {
        this.gameContainer = document.getElementById('gameContainer');
        this.dino = document.getElementById('dino');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        
        this.isGameRunning = false;
        this.isJumping = false;
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore') || 0;
        this.gameSpeed = 2;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.gameLoop = null;
        this.difficultyLevel = 1;
        
        this.init();
    }
    
    init() {
        this.updateScore();
        this.setupEventListeners();
        this.dino.classList.add('running');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!this.isGameRunning) {
                    this.startGame();
                } else {
                    this.jump();
                }
            }
            
            if (e.code === 'KeyR' && !this.isGameRunning) {
                this.resetHighScore();
            }
        });
        
        this.gameContainer.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.isGameRunning) {
                this.startGame();
            } else {
                this.jump();
            }
        });
        
        this.gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isGameRunning) {
                this.startGame();
            } else {
                this.jump();
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        window.addEventListener('blur', () => {
            if (this.isGameRunning) {
                this.pauseGame();
            }
        });
        
        window.addEventListener('focus', () => {
            if (this.isGameRunning) {
                this.resumeGame();
            }
        });
    }
    
    createClouds() {

    }
    
    startGame() {
        this.isGameRunning = true;
        this.score = 0;
        this.gameSpeed = 4;
        this.difficultyLevel = 1;
        this.obstacles = [];
        this.obstacleTimer = 0;
        
        this.gameOverElement.style.display = 'none';
        this.dino.classList.add('running');
        this.dino.classList.remove('jumping');
        
        document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());
        
        document.querySelectorAll('.paused').forEach(el => {
            el.classList.remove('paused');
        });
        
        this.gameLoop = setInterval(() => this.update(), 20);
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    jump() {
        if (!this.isJumping && this.isGameRunning) {
            this.isJumping = true;
            this.dino.classList.add('jumping');
            
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            setTimeout(() => {
                this.isJumping = false;
                if (this.isGameRunning) {
                    this.dino.classList.add('running');
                    this.dino.classList.remove('jumping');
                }
            }, 600);
        }
    }
    
    createObstacle() {
        const types = ['cactus', 'cactus small'];
        const type = types[Math.floor(Math.random() * types.length)];
        const obstacle = document.createElement('div');
        obstacle.className = type;
        obstacle.style.right = '-40px';
        obstacle.style.position = 'absolute';
        obstacle.style.bottom = '20px';
        this.gameContainer.appendChild(obstacle);
        this.obstacles.push(obstacle);
    }
    
    update() {
        this.score += 1;
        this.updateScore();

        if (this.score % 500 === 0 && this.score > 0) {
            this.difficultyLevel++;
            this.gameSpeed += 0.3;
            this.gameContainer.style.filter = 'brightness(1.2)';
            setTimeout(() => {
                this.gameContainer.style.filter = 'brightness(1)';
            }, 200);
        }

        this.obstacleTimer++;
        const obstacleFrequency = Math.max(80 - (this.difficultyLevel * 5), 40);

        if (this.obstacleTimer > Math.random() * obstacleFrequency + obstacleFrequency) {
            this.createObstacle();
            this.obstacleTimer = 0;
        }

        this.obstacles.forEach((obstacle, index) => {
            const currentRight = parseInt(obstacle.style.right) || 0;
            obstacle.style.right = (currentRight + this.gameSpeed) + 'px';

            if (currentRight > 950) {
                obstacle.remove();
                this.obstacles.splice(index, 1);
            }

            if ((obstacle.classList.contains('cactus') || obstacle.classList.contains('cactus small')) && this.checkCollision(obstacle)) {
                this.gameOver();
            }
        });
    }
    
    checkCollision(obstacle) {
        const dinoRect = this.dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        const margin = 8;
        
        return !(dinoRect.right < obstacleRect.left + margin || 
                dinoRect.left > obstacleRect.right - margin || 
                dinoRect.bottom < obstacleRect.top + margin || 
                dinoRect.top > obstacleRect.bottom - margin);
    }
    
    gameOver() {
        this.isGameRunning = false;
        clearInterval(this.gameLoop);
        
        document.querySelectorAll('.cactus, .ground').forEach(el => {
            el.classList.add('paused');
        });
        
        this.dino.classList.remove('running', 'jumping');
        this.dino.classList.remove('running', 'jumping');
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
            
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            }
        }
        
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
        this.updateScore();
        
        this.gameContainer.style.filter = 'grayscale(0.5)';
        setTimeout(() => {
            this.gameContainer.style.filter = 'grayscale(0)';
        }, 1000);
    }
    
    pauseGame() {
        if (this.isGameRunning) {
            clearInterval(this.gameLoop);
            document.querySelectorAll('.cactus, .ground').forEach(el => {
                el.classList.add('paused');
            });
        }
    }
    
    resumeGame() {
        if (this.isGameRunning) {
            document.querySelectorAll('.paused').forEach(el => {
                el.classList.remove('paused');
            });
            this.gameLoop = setInterval(() => this.update(), 20);
        }
    }
    
    updateScore() {
        const scoreStr = this.score.toString().padStart(5, '0');
        const highScoreStr = this.highScore.toString().padStart(5, '0');
        this.scoreElement.textContent = `HI ${highScoreStr} ${scoreStr}`;
    }
    
    resetHighScore() {
        this.highScore = 0;
        localStorage.removeItem('dinoHighScore');
        this.updateScore();
        
        this.scoreElement.style.color = '#DC143C';
        setTimeout(() => {
            this.scoreElement.style.color = '#2F4F4F';
        }, 500);
    }
    
    restart() {
        clearInterval(this.gameLoop);
        
        document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());
        this.obstacles = [];
        
        document.querySelectorAll('.paused').forEach(el => {
            el.classList.remove('paused');
        });
        
        this.gameContainer.style.filter = 'grayscale(0)';
        
        this.startGame();
    }
}

let game;

window.addEventListener('load', () => {
    game = new DinoGame();
});

function restartGame() {
    game.restart();
}

window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (game && !game.isGameRunning) {
            game.updateScore();
        }
    }, 100);
});

if (navigator.vibrate) {
    console.log('Vibración soportada - Se agregaron efectos de vibración');
} else {
    console.log('Vibración no soportada en este dispositivo');
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyG' && game && !game.isGameRunning && game.highScore === 0) {
        console.log('Modo debug activado - Cheat codes disponibles');
    }
});