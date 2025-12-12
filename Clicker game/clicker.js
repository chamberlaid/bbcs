// Game page JavaScript
const clickButton = document.getElementById('clickButton');
const resetButton = document.getElementById('resetButton');
const progressBar = document.getElementById('progressBar');
const counterDisplay = document.getElementById('counterDisplay');
const popupModal = document.getElementById('popupModal');
const popupMessage = document.getElementById('popupMessage');
const closeModalButton = document.getElementById('closeModal');

let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;
const maxCounter = 1000000;

function updateCounter() {
    counterDisplay.textContent = `$${counter}`;
}

function updateProgressBar() {
    const progressPercentage = (counter / maxCounter) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function saveProgress() {
    localStorage.setItem('counter', counter);
}

function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

// Function to check if the player reaches the exact target or exceeds it
function checkProgress() {
    if (counter === maxCounter) {
        showPopup("Success! You've reached the exact target!", 'green');
    } else if (counter > maxCounter) {
        showPopup("Fail! You exceeded the target!", 'red');
    }
}

// Show the popup modal with a success or fail message
function showPopup(message, color) {
    popupMessage.textContent = message;
    popupMessage.style.color = color;  // Set message color (green for success, red for fail)
    popupModal.style.display = 'flex'; // Show the popup
}

// Close the popup modal
closeModalButton.addEventListener('click', () => {
    popupModal.style.display = 'none'; // Hide the popup
});

function checkMilestones() {
    const milestones = [5, 10, 25, 50, 70, 80];
    const progressPercentage = (counter / maxCounter) * 100;
    const unlockedBackgrounds = JSON.parse(localStorage.getItem('unlockedBackgrounds')) || [];

    milestones.forEach(milestone => {
        if (progressPercentage >= milestone && !unlockedBackgrounds.includes(milestone)) {
            unlockedBackgrounds.push(milestone);
            localStorage.setItem('unlockedBackgrounds', JSON.stringify(unlockedBackgrounds));
            alert(`Congratulations! You've unlocked a background for reaching ${milestone}% progress.`);
        }
    });
}

clickButton.addEventListener('click', () => {
    if (counter < maxCounter) {
        const randomIncrement = getRandomNumber();
        counter += randomIncrement;
        updateCounter();
        updateProgressBar();
        saveProgress();
        checkProgress();
        checkMilestones();
    }
});

resetButton.addEventListener('click', () => {
    counter = 0;
    updateCounter();
    updateProgressBar();
    popupMessage.textContent = '';
    popupModal.style.display = 'none';
    localStorage.removeItem('counter');
});

// Load the selected background from localStorage when the game page loads
window.onload = () => {
    const selectedBackground = localStorage.getItem('selectedBackground');
    if (selectedBackground) {
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    }
};

updateCounter();
updateProgressBar();
checkProgress();
