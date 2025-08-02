class DinoGame{
    constructor(){
        this.gameContainer = document.getElementById('gameContainer')
        this.dino = document.getElementById("dino")
        this.scoreElement = document.getElementById('score')
        this.gameOverElement = document.getElementById('gameOver')
        this.finalScoreElement = document.getElementById('finalScore')

        this.isGameRunning = false;
        this.isJumping = false;
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore')|| 0;
        this.gameSpeed = 2;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.gameLoop = null;
        this.difficultyLevel = 1;

        this.init()
    }

    init(){
        this.updateScore();
        this.setupEventListeners();
    
        this.dino.classList.add('running');
    }
        setupEventListeners(){
            document.addEventListener('keydown', (e)=>{
                if(e.code === 'spcace' || e.code === 'ArrowUp')
            })
        }
}