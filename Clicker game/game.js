// Get elements
const counterDisplay = document.getElementById('counterDisplay');
const clickButton = document.getElementById('clickButton');
const resetButton = document.getElementById('resetButton'); // Reset button element
const progressBar = document.getElementById('progressBar');
const messageDisplay = document.getElementById('messageDisplay'); // To display success/fail messages

// Initial counter value and max counter value for progress bar
let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;
const maxCounter = 100;

// Update the counter display with a '$' symbol
function updateCounter() {
    counterDisplay.textContent = `$${counter}`;  // Add '$' symbol before the counter
}

// Update the progress bar based on the counter
function updateProgressBar() {
    const progressPercentage = (counter / maxCounter) * 100;
    progressBar.style.width = progressPercentage + '%';
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('counter', counter); // Save the counter value
}

// Function to generate a random number between 1 and 100
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1; // Random number from 1 to 100
}

// Function to check if the player reaches the exact target or exceeds it
function checkProgress() {
    if (counter === maxCounter) {
        messageDisplay.textContent = "Success! You've reached the exact target!";
        messageDisplay.style.color = 'green';  // Success message color
    } else if (counter > maxCounter) {
        messageDisplay.textContent = "Fail! You exceeded the target!";
        messageDisplay.style.color = 'red';  // Fail message color
    }
}

// Handle the click event (increase counter by a random number)
clickButton.addEventListener('click', () => {
    if (counter < maxCounter) {
        const randomIncrement = getRandomNumber();
        counter += randomIncrement; // Increase counter by the random value
        updateCounter();
        updateProgressBar();
        saveProgress(); // Save progress every time the button is clicked
        checkProgress(); // Check if the player reached or exceeded the target
    }
});

// Handle the reset event (reset counter and progress)
resetButton.addEventListener('click', () => {
    counter = 0; // Reset counter
    updateCounter(); // Update display
    updateProgressBar(); // Reset progress bar
    messageDisplay.textContent = ''; // Clear the message
    localStorage.removeItem('counter'); // Remove progress from localStorage
});

// Initial setup - Load progress from localStorage
updateCounter();
updateProgressBar();
checkProgress(); // Check progress on page load
