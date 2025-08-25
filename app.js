// Theme toggle
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;

themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  themeBtn.innerHTML = body.classList.contains("dark")
    ? '<i data-feather="sun"></i>'
    : '<i data-feather="moon"></i>';
  feather.replace();
});

// Typing effect in hero tagline
new Typed("#typed", {
  strings: [
    "Software Developer 👨‍💻",
    "Mainframe & Java Specialist ⚡",
    "Cloud Certified ☁️",
    "Tech Explorer 🚀"
  ],
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 2000,
  loop: true
});

// Scroll reveal animation
window.addEventListener("scroll", reveal);
function reveal() {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}
