// Footer Year and Last Modified
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Mobile Menu Toggle
const menuButton = document.getElementById('menuButton');
const navMenu = document.getElementById('navMenu');

menuButton.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
        menuButton.innerHTML = '&#9776;'; // Hamburger
    } else {
        navMenu.style.display = 'flex';
        menuButton.innerHTML = '✖'; // Close
    }
});
