// containers
const menuContainer = document.getElementById('menuContainer');
const gameContainer = document.getElementById('gameContainer');

// input & buttons
const usernameInput = document.getElementById('usernameInput');
const whiteDiscBtn = document.getElementById('whiteDiscBtn');
const blackDiscBtn = document.getElementById('blackDiscBtn');
const startBtn = document.getElementById('startBtn');

// game elements
const usernameText = document.getElementById('usernameText');
const whiteDiscCountText = document.getElementById('whiteDiscCountText');
const blackDiscCountText = document.getElementById('blackDiscCountText');
const musicBtn = document.getElementById('musicBtn');
const gameOverText = document.getElementById('gameOverText');
const backgroundMusic = document.getElementById('backgroundMusic');
const gameOverScreen = document.getElementById('gameOverScreen');
const countdownText = document.getElementById('countdownText');
const countdownScreen = document.getElementById('countdownScreen');

function validateInput() {
    let username = usernameInput.value;

    startBtn.disabled = username.trim() === '';
}

let playerColor = null;

usernameInput.addEventListener('input', validateInput);
blackDiscBtn.addEventListener('click', () => {
    playerColor = 1;
});

whiteDiscBtn.addEventListener('click', () => {
    playerColor = 2;
});
musicBtn.addEventListener('click', () => {
    if (musicBtn.innerHTML === 'Enable Music') {
        musicBtn.innerHTML = 'Disable Music';
        backgroundMusic.play();
    } else {
        musicBtn.innerHTML = 'Enable Music';
        backgroundMusic.pause();
    }
})

startBtn.addEventListener('click', () => {
    if (playerColor === null) {
        alert('please pick a color');
        return;
    }
    // menuContainer.style.display = 'none';
    gameContainer.style.display = 'flex';
    menuContainer.classList.add('dissapear');

    usernameText.innerHTML = usernameInput.value;

    gameStart();
});