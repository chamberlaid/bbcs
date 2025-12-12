// Get elements
const counterDisplay = document.getElementById('counterDisplay');
const clickButton = document.getElementById('clickButton');
const resetButton = document.getElementById('resetButton'); 
const progressBar = document.getElementById('progressBar');
const popupModal = document.getElementById('popupModal'); 
const popupMessage = document.getElementById('popupMessage'); 
const closeModalButton = document.getElementById('closeModal'); 


let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;
const maxCounter = 10000;


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


function checkProgress() {
    if (counter === maxCounter) {
        showPopup("Success! You've reached the exact target!", 'green');
    } else if (counter > maxCounter) {
        showPopup("Fail! You exceeded the target!", 'red');
    }
}


function showPopup(message, color) {
    popupMessage.textContent = message;
    popupMessage.style.color = color; 
    popupModal.style.display = 'flex';
}


closeModalButton.addEventListener('click', () => {
    popupModal.style.display = 'none'; 
});

clickButton.addEventListener('click', () => {
    if (counter < maxCounter) {
        const randomIncrement = getRandomNumber();
        counter += randomIncrement; 
        updateCounter();
        updateProgressBar();
        saveProgress(); 
        checkProgress(); 
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

window.onload = () => {
    const selectedBackground = localStorage.getItem('selectedBackground');
    if (selectedBackground) {
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    }
};


updateCounter();
updateProgressBar();
checkProgress(); 