const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;
let lastBubble = 0;
let lastSnow = 0;

function addParticle(container, className) {
  const particle = document.createElement("i");
  particle.className = className;
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
  particle.style.setProperty("--duration", `${8 + Math.random() * 12}s`);
  particle.style.setProperty("--size", `${2 + Math.random() * 4}px`);
  container.append(particle);
  window.setTimeout(() => particle.remove(), 22000);
}

function animate(time) {
  if (document.hidden) {
    frame = 0;
    return;
  }
  const bubbles = document.getElementById("ocean-bubbles");
  const snow = document.getElementById("marine-snow");
  if (!reducedMotion.matches && time - lastBubble > 1500 && bubbles) {
    addParticle(bubbles, "ambient-bubble");
    lastBubble = time;
  }
  if (!reducedMotion.matches && time - lastSnow > 280 && snow && snow.childElementCount < 55) {
    addParticle(snow, "snow-particle");
    lastSnow = time;
  }
  frame = requestAnimationFrame(animate);
}

export function initOcean() {
  if (!frame) frame = requestAnimationFrame(animate);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    else if (!frame) frame = requestAnimationFrame(animate);
  });
  window.addEventListener("scroll", () => {
    const progress = Math.min(window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight), 1);
    document.documentElement.style.setProperty("--depth-progress", progress.toFixed(3));
    const depth = Math.round(progress * 4000).toLocaleString("id-ID");
    document.querySelectorAll("#header-depth, #depth-readout").forEach((el) => { el.textContent = `${depth} m`; });
  }, { passive: true });

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || reducedMotion.matches) return;
    const root = document.getElementById("touch-ripples");
    if (!root) return;
    const ripple = document.createElement("span");
    ripple.className = "touch-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    root.append(ripple);
    window.setTimeout(() => ripple.remove(), 900);
    for (let index = 0; index < 3; index += 1) {
      const bubble = document.createElement("i");
      bubble.className = "touch-bubble";
      bubble.style.left = `${event.clientX + (Math.random() - .5) * 28}px`;
      bubble.style.top = `${event.clientY + (Math.random() - .5) * 20}px`;
      bubble.style.setProperty("--bubble-drift", `${(Math.random() - .5) * 28}px`);
      root.append(bubble);
      window.setTimeout(() => bubble.remove(), 1100);
    }
  });
}
