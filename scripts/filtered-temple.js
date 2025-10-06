// =========================
// Footer Year & Last Modified
// =========================
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// =========================
// Mobile Menu Toggle
// =========================
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

// =========================
// Temple Data
// =========================
const temples = [
    {
        templeName: "Salt Lake Temple",
        location: "Salt Lake City, Utah, USA",
        dedicated: "April 6, 1893",
        area: 253015,
        imageUrl: "image/temple3.jpg"
    },
    {
        templeName: "Nauvoo Illinois Temple",
        location: "Nauvoo, Illinois, USA",
        dedicated: "June 27, 2002",
        area: 54000,
        imageUrl: "image/nauvoo.jpeg"
    },
    {
        templeName: "Accra Ghana Temple",
        location: "Accra, Ghana",
        dedicated: "January 11, 2004",
        area: 17500,
        imageUrl: "image/accra.jpeg"
    },
    {
        templeName: "Aba Nigeria Temple",
        location: "Aba, Nigeria",
        dedicated: "August 7, 2005",
        area: 11500,
        imageUrl: "image/aba.webp"
    },
    {
        templeName: "Rome Italy Temple",
        location: "Rome, Italy",
        dedicated: "March 10, 2019",
        area: 41010,
        imageUrl: "image/rome.jpeg"
    },
    {
        templeName: "Laie Hawaii Temple",
        location: "Laie, Hawaii, USA",
        dedicated: "November 27, 1919",
        area: 42000,
        imageUrl: "image/Laie.jpg"
    },
    {
        templeName: "Papeete Tahiti Temple",
        location: "Papeete, Tahiti",
        dedicated: "October 27, 1983",
        area: 12877,
        imageUrl: "image/papeete.jpeg"
    },
    {
        templeName: "Manhattan New York Temple",
        location: "New York City, New York, USA",
        dedicated: "June 13, 2004",
        area: 20630,
        imageUrl: "image/manhattan.jpeg"
    },
    {
        templeName: "Hong Kong China Temple",
        location: "Hong Kong, China",
        dedicated: "May 26, 1996",
        area: 21900,
        imageUrl: "image/hong.jpeg"
    },
    {
        templeName: "Colonia Juárez Chihuahua Temple",
        location: "Colonia Juárez, Mexico",
        dedicated: "March 6, 1999",
        area: 6800,
        imageUrl: "image/colonia.jpeg"
    }
];

// =========================
// Function to Display Temples
// =========================
function displayTemples(filteredTemples) {
    const container = document.getElementById("templeCards");
    container.innerHTML = ""; // Clear previous content

    filteredTemples.forEach(temple => {
        const card = document.createElement("div");
        card.classList.add("temple-card");

        card.innerHTML = `
            <h2>${temple.templeName}</h2>
            <p><span class="label">Location:</span> ${temple.location}</p>
            <p><span class="label">Dedicated:</span> ${temple.dedicated}</p>
            <p><span class="label">Area:</span> ${temple.area.toLocaleString()} sq ft</p>
            <img src="${temple.imageUrl}" alt="Image of ${temple.templeName}" loading="lazy">
        `;

        container.appendChild(card);
    });
}

// =========================
// Filter Buttons
// =========================
document.getElementById("home").addEventListener("click", () => displayTemples(temples));

document.getElementById("old").addEventListener("click", () => {
    displayTemples(temples.filter(t => new Date(t.dedicated).getFullYear() < 1900));
});

document.getElementById("new").addEventListener("click", () => {
    displayTemples(temples.filter(t => new Date(t.dedicated).getFullYear() > 2000));
});

document.getElementById("large").addEventListener("click", () => {
    displayTemples(temples.filter(t => t.area > 90000));
});

document.getElementById("small").addEventListener("click", () => {
    displayTemples(temples.filter(t => t.area < 10000));
});

// =========================
// Initial Display
// =========================
displayTemples(temples);
