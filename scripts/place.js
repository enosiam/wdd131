// place.js

// Insert current year
document.getElementById("year").textContent = new Date().getFullYear();

// Insert last modified date
document.getElementById("lastmodified").textContent = document.lastModified;

// Wind chill calculation
function calculateWindChill(tempC, windKmh) {
    // Convert wind speed to m/s
    let windMs = windKmh / 3.6;

    if (tempC <= 10 && windKmh > 4.8) {
        // Wind chill formula (Celsius version)
        return (
            13.12 +
            0.6215 * tempC -
            11.37 * Math.pow(windMs, 0.16) +
            0.3965 * tempC * Math.pow(windMs, 0.16)
        ).toFixed(1);
    } else {
        return "N/A";
    }
}

// Grab elements
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const windChillEl = document.getElementById("windchill");

let temp = parseFloat(tempEl.textContent);
let wind = parseFloat(windEl.textContent);

// Update wind chill display
windChillEl.textContent = calculateWindChill(temp, wind);
