// ✅ Mobile hamburger menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".main-nav ul");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});

// ✅ Footer year + last modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastmodified").textContent = document.lastModified;
