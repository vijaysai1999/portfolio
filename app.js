// Animate fade-in for sections, delay sequentially for visual effect
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.animationDelay = `${0.2 + i*0.13}s`;
    el.classList.add('fade-in');
  });
});

// Dynamic background gradient change every few seconds
setInterval(() => {
  const hues = [Math.random()*360, Math.random()*360];
  document.body.style.background = `linear-gradient(135deg, hsl(${hues},90%,55%) 0%, hsl(${hues[1]},90%,72%) 100%)`;
}, 7000);
