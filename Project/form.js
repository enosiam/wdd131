// form.js

// Product array - each object has id and name
const products = [
    { id: "p-001", name: "New Musk" },
    { id: "p-002", name: "Smart Collection" },
    { id: "p-003", name: "Valentinho" },
    { id: "p-004", name: "Hugs" },
    { id: "p-005", name: "Red Cherry" },
    { id: "p-006", name: "Burberry Weekend" }
];

// Populate select
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("productSelect");
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;       // value uses product id per your requirement
        opt.textContent = p.name; // display uses product name
        select.appendChild(opt);
    });

    // Optional: ensure radio button selection UI shows star color on click
    document.querySelectorAll(".star input").forEach(radio => {
        radio.addEventListener("change", (e) => {
            // Remove highlight from siblings
            document.querySelectorAll(".star span").forEach(s => s.style.color = "#d1d5db");
            // Highlight selected
            const selectedSpan = e.target.nextElementSibling;
            if (selectedSpan) selectedSpan.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#f59e0b';
        });
    });

    // Improve keyboard accessibility: when focus on star input, show focus style
    document.querySelectorAll('.star input').forEach(inp => {
        inp.addEventListener('focus', () => {
            inp.parentElement.style.outline = '2px solid rgba(21,94,117,0.15)';
        });
        inp.addEventListener('blur', () => {
            inp.parentElement.style.outline = 'none';
        });
    });

    // No JS submission interception — we rely on GET to review.html per spec
});
