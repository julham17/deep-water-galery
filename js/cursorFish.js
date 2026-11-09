const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function initCursorFish() {
  const fish = document.getElementById("cursor-fish");
  if (!fish || !window.matchMedia("(pointer: fine)").matches || reducedMotion.matches) return;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;
  let previousX = x;
  let previousY = y;
  let speed = 0;
  let frame = 0;

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  }, { passive: true });

  function tick() {
    x += (targetX - x) * 0.14;
    y += (targetY - y) * 0.14;
    const dx = x - previousX;
    const dy = y - previousY;
    speed += (Math.min(Math.hypot(dx, dy), 18) - speed) * 0.2;
    const angle = Math.atan2(dy, Math.abs(dx) || 0.01) * 180 / Math.PI;
    fish.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${dx < -0.5 ? 180 - angle : angle}deg)`;
    fish.style.setProperty("--tail-speed", `${Math.max(0.18, 0.65 - speed * 0.025)}s`);
    if (speed > 1.8 && Math.random() > 0.7) {
      const bubble = document.createElement("i");
      bubble.className = "cursor-bubble";
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      document.body.append(bubble);
      window.setTimeout(() => bubble.remove(), 850);
    }
    previousX = x;
    previousY = y;
    frame = Math.hypot(targetX - x, targetY - y) > 0.5 ? requestAnimationFrame(tick) : 0;
  }

  window.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") return;
    fish.classList.remove("fish-dash");
    void fish.offsetWidth;
    fish.classList.add("fish-dash");
    for (let i = 0; i < 5; i += 1) {
      const bubble = document.createElement("i");
      bubble.className = "cursor-bubble dash-bubble";
      bubble.style.left = `${event.clientX + (Math.random() - 0.5) * 36}px`;
      bubble.style.top = `${event.clientY + (Math.random() - 0.5) * 30}px`;
      document.body.append(bubble);
      window.setTimeout(() => bubble.remove(), 900);
    }
  });

  document.addEventListener("pointerover", (event) => {
    fish.classList.toggle("cursor-hover", Boolean(event.target.closest("a, button, input, select, [role='button']")));
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  document.addEventListener("pointerleave", () => fish.classList.add("cursor-hidden"));
  document.addEventListener("pointerenter", () => fish.classList.remove("cursor-hidden"));
}
