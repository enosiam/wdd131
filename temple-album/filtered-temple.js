// Function to create and display temple cards
function displayTemples(filteredTemples) {
    const container = document.getElementById("templeCards");
    container.innerHTML = ""; // Clear previous content

    filteredTemples.forEach(temple => {
        const card = document.createElement("div");
        card.classList.add("temple-card");

        card.innerHTML = `
            <h2>${temple.templeName}</h2>
            <p><span class="label">LOCATION:</span> ${temple.location}</p>
            <p><span class="label">DEDICATED:</span> ${temple.dedicated}</p>
            <p><span class="label">SIZE:</span> ${temple.area.toLocaleString()} sq ft</p>
            <img src="${temple.imageUrl}" alt="Image of ${temple.templeName}" loading="lazy">
        `;

        container.appendChild(card);
    });
}

