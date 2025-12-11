const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');

const scoreSpan = document.getElementById('score');
const hpSpan = document.getElementById('hp');
const finalScoreSpan = document.getElementById('final-score');

const bgMusic = document.getElementById('bg-music');

let score = 0;
let hp = 5;
let gameRunning = false;

function showScreen(screen) {
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  endScreen.classList.remove('active');
  screen.classList.add('active');
}

// start button
startBtn.addEventListener('click', () => {
  resetGame();
  showScreen(gameScreen);
  startGameLoop();
  bgMusic.currentTime = 0;
  bgMusic.play();
});

// restart button
restartBtn.addEventListener('click', () => {
  resetGame();
  showScreen(gameScreen);
  startGameLoop();
  bgMusic.currentTime = 0;
  bgMusic.play();
});

// back button (return to start screen)
backBtn.addEventListener('click', () => {
  // stop the game loop and music, reset UI, then go back
  gameRunning = false;
  bgMusic.pause();
  resetGame();
  showScreen(startScreen);
});

function resetGame() {
  score = 0;
  hp = 5;
  scoreSpan.textContent = score;
  hpSpan.textContent = hp;
}

function endGame() {
  gameRunning = false;
  bgMusic.pause();
  finalScoreSpan.textContent = score;
  showScreen(endScreen);
}

function startGameLoop() {
  gameRunning = true;
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // TODO: your asteroid + rhythm logic here
  function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw stuff here

    requestAnimationFrame(loop);
  }

  loop();
}
