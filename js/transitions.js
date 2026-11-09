const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function transitionTo(update) {
  if (document.startViewTransition && !reducedMotion.matches) {
    document.startViewTransition(update);
    return;
  }
  const curtain = document.querySelector(".transition-curtain");
  if (reducedMotion.matches || !curtain) {
    update();
    return;
  }
  curtain.classList.remove("curtain-out");
  curtain.classList.add("curtain-in");
  window.setTimeout(() => {
    update();
    requestAnimationFrame(() => {
      curtain.classList.remove("curtain-in");
      curtain.classList.add("curtain-out");
    });
  }, 420);
  window.setTimeout(() => curtain.classList.remove("curtain-out"), 1000);
}
