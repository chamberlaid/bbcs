
const backgroundOptions = document.getElementById('backgroundOptions');
const unlockedBackgrounds = JSON.parse(localStorage.getItem('unlockedBackgrounds')) || [];


const availableBackgrounds = [
    'https://media.istockphoto.com/id/2007594750/vector/seamless-mystic-pattern-with-sun-moon-and-stars-cosmos-background-in-tarot-style-space-and.jpg?s=612x612&w=0&k=20&c=QqLaFuBfMmnGk9BumjCnTZAaqct6OssGGq0GowV-9G8=', // Background for 5% progress
    'https://images.photowall.com/products/60833/fuji-mountain-in-autumn.jpg?h=699&q=85', // Background for 10% progress
    'https://img.freepik.com/free-photo/view-starry-night-sky-with-nature-mountains-landscape_23-2151614748.jpg?semt=ais_hybrid&w=740&q=80', // Background for 25% progress
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRffa5M66jh0bxjwdt5t7gUOjlbLVgdybnXDw&s', // Background for 50% progress
    'https://giffiles.alphacoders.com/220/220890.gif', // Background for 70% progress
    'https://i.pinimg.com/originals/74/d6/ff/74d6ff9f2ffa4c61bed3b775b424cab0.gif'  // Background for 80% progress
];


const milestones = [5, 10, 25, 50, 70, 80];


unlockedBackgrounds.forEach(milestone => {
    const index = milestones.indexOf(milestone);
    const backgroundPath = availableBackgrounds[index];
    const imgElement = document.createElement('img');
    imgElement.src = backgroundPath;
    imgElement.alt = `Background for ${milestone}%`;
    imgElement.onclick = () => {
        
        localStorage.setItem('selectedBackground', backgroundPath);
        changeBackground(backgroundPath);
    };
    backgroundOptions.appendChild(imgElement);
});


function changeBackground(backgroundPath) {
    
    document.body.style.backgroundImage = `url('${backgroundPath}')`;

    
    localStorage.setItem('selectedBackground', backgroundPath);
}
