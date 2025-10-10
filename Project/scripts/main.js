// Auto year
document.getElementById("year").textContent = new Date().getFullYear();

// JS Object + Array
const temples = [
  { name: "Salt Lake Temple", year: 1893 },
  { name: "Accra Ghana Temple", year: 2004 },
  { name: "Lagos Nigeria Temple", year: 2022 },
  { name: "Manila Philippines Temple", year: 1984 },
  { name: "London England Temple", year: 1958 },
];

// Filter Function (Conditionals + Template Literals + DOM)
function filterTemples() {
  const choice = document.getElementById("yearSelect").value;
  let filtered;

  if (choice === "before1900") {
    filtered = temples.filter((t) => t.year < 1900);
  } else if (choice === "1900to2000") {
    filtered = temples.filter((t) => t.year >= 1900 && t.year < 2000);
  } else {
    filtered = temples.filter((t) => t.year >= 2000);
  }

  const result =
    filtered.length > 0
      ? `🏛️ Found ${filtered.length} temple(s): ${filtered
          .map((t) => `${t.name} (${t.year})`)
          .join(", ")}`
      : "No temples found in that range.";

  document.getElementById("filterResult").textContent = result;

  localStorage.setItem("lastFilter", choice);
}

// Event Listener
document.getElementById("filterBtn")?.addEventListener("click", filterTemples);

// Restore last filter
window.addEventListener("load", () => {
  const last = localStorage.getItem("lastFilter");
  if (last) document.getElementById("yearSelect").value = last;
});

