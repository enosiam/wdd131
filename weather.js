// ✅ Wind Chill calculation
function calculateWindChill(t, s) {
    return (t <= 10 && s > 5)
        ? (13.12 + 0.6215 * t - 11.37 * Math.pow(s, 0.16) + 0.3965 * t * Math.pow(s, 0.16)).toFixed(1) + " °C"
        : "N/A";
}

const temp = parseFloat(document.getElementById("temp").textContent);
const wind = parseFloat(document.getElementById("wind").textContent);
document.getElementById("windchill").textContent = calculateWindChill(temp, wind);
