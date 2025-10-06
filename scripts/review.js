// js/review.js

// helper to get product display name by id (same products array used in form.js)
const products = {
    "p-001": "New Musk",
    "p-002": "Smart Collection",
    "p-003": "Valentinho",
    "p-004": "Hugs",
    "p-005": "Red Cherry",
    "p-006": "Burberry Weekend"
};

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);

    // Grab fields
    const productId = params.get("productId") || "";
    const rating = params.get("rating") || "—";
    const installDate = params.get("installDate") || "—";
    const reviewText = params.get("reviewText") || "—";
    const userName = params.get("userName") || "Anonymous";

    // Features: checkboxes with same name produce multiple entries; use getAll
    const features = params.getAll("features"); // may be empty array

    const summary = document.getElementById("summaryList");

    // Add rows to definition list (dt/dd)
    function addRow(label, value) {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        summary.appendChild(dt);
        summary.appendChild(dd);
    }

    addRow("Product", products[productId] || productId || "—");
    addRow("Rating", rating);
    addRow("Features", features.length ? features.join(", ") : "None selected");
    addRow("Review", reviewText ? reviewText : "No review text");
    addRow("Reviewer", userName ? userName : "Anonymous");

    // localStorage counter
    const key = "reviewCount";
    let count = parseInt(localStorage.getItem(key) || "0", 10);
    count = count + 1;
    localStorage.setItem(key, String(count));
    document.getElementById("reviewCount").textContent = count;
});
