import { getRoute } from "./router.js";
import { renderPage, galleryState, getFilteredFishes, renderFishCards } from "./pages.js";
import { transitionTo } from "./transitions.js";
import { initCursorFish } from "./cursorFish.js";
import { initOcean } from "./ocean.js";
import { fishes } from "../data/fishes.js";

const main = document.getElementById("main-content");
let currentRoute = "";

function routeKey(route) {
  return `${route.page}:${route.id || ""}`;
}

function render({ transition = false } = {}) {
  const route = getRoute();
  const key = routeKey(route);
  const update = () => {
    main.innerHTML = renderPage(route);
    document.body.dataset.page = route.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const active = link.dataset.nav === route.page || (route.page === "fish" && link.dataset.nav === "gallery");
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = route.page === "fish"
      ? `${fishes.find((fish) => fish.id === route.id)?.name || "Spesies"} — Deep Water Galery`
      : "Deep Water Galery — Penghuni Kegelapan Samudra";
    window.scrollTo({ top: 0, behavior: "auto" });
    currentRoute = key;
  };
  if (transition && currentRoute && currentRoute !== key) transitionTo(update);
  else update();
}

window.addEventListener("hashchange", () => render({ transition: true }));
document.addEventListener("input", (event) => {
  if (event.target.id !== "fish-search") return;
  galleryState.query = event.target.value;
  updateGallery();
});
document.addEventListener("click", (event) => {
  const fishCard = event.target.closest(".fish-card");
  if (fishCard) {
    const image = fishCard.querySelector(".card-fish");
    if (image) image.style.viewTransitionName = "fish-art";
  }
  const zoneButton = event.target.closest("[data-zone]");
  if (zoneButton) {
    galleryState.zone = zoneButton.dataset.zone;
    document.querySelectorAll("[data-zone]").forEach((button) => {
      const active = button.dataset.zone === galleryState.zone;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateGallery();
  }
  const detailArt = event.target.closest("#detail-art-wrap");
  if (detailArt) {
    detailArt.classList.remove("detail-dash");
    void detailArt.offsetWidth;
    detailArt.classList.add("detail-dash");
    for (let index = 0; index < 8; index += 1) {
      const bubble = document.createElement("i");
      bubble.className = "detail-bubble";
      bubble.style.left = `${42 + Math.random() * 16}%`;
      bubble.style.top = `${43 + Math.random() * 14}%`;
      bubble.style.setProperty("--bubble-drift", `${(Math.random() - .5) * 70}px`);
      detailArt.append(bubble);
      window.setTimeout(() => bubble.remove(), 1400);
    }
  }
});

document.addEventListener("pointermove", (event) => {
  const art = event.target.closest("#detail-art-wrap");
  if (!art || event.pointerType !== "mouse") return;
  const bounds = art.getBoundingClientRect();
  const offsetX = (event.clientX - bounds.left) / bounds.width - .5;
  const offsetY = (event.clientY - bounds.top) / bounds.height - .5;
  art.style.setProperty("--parallax-x", `${offsetX * 14}px`);
  art.style.setProperty("--parallax-y", `${offsetY * 12}px`);
  art.style.setProperty("--tilt-x", `${-offsetY * 4}deg`);
  art.style.setProperty("--tilt-y", `${offsetX * 5}deg`);
}, { passive: true });

document.addEventListener("pointerout", (event) => {
  const art = event.target.closest("#detail-art-wrap");
  if (!art || event.relatedTarget?.closest("#detail-art-wrap")) return;
  ["--parallax-x", "--parallax-y", "--tilt-x", "--tilt-y"].forEach((property) => {
    art.style.removeProperty(property);
  });
});

function updateGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const results = getFilteredFishes();
  grid.innerHTML = renderFishCards(results);
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-state");
  if (count) count.textContent = String(results.length);
  if (empty) empty.hidden = results.length > 0;
}

render();
initCursorFish();
initOcean();
