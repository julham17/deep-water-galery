import { fishes } from "../data/fishes.js";

const icons = {
  depth: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18m-6-6 6 6 6-6M5 5h14"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function fishArt(fish, className = "") {
  const sharedName = className === "detail-fish" ? ";view-transition-name:fish-art" : "";
  return `<img class="${className}" src="./${escapeHTML(fish.image)}" alt="${escapeHTML(fish.name)}" style="--fish-glow:${escapeHTML(fish.glowColor)}${sharedName}">`;
}

function fishCard(fish, index) {
  return `<a class="fish-card reveal" href="#/fish/${encodeURIComponent(fish.id)}" style="--card-delay:${index * 65}ms">
    <div class="card-art" style="--fish-glow:${fish.glowColor}"><span class="card-number">${String(index + 1).padStart(2, "0")}</span>${fishArt(fish, "card-fish")}<span class="card-depth">${escapeHTML(fish.depth)}</span></div>
    <div class="card-copy"><span class="eyebrow">${escapeHTML(fish.zone)}</span><h3>${escapeHTML(fish.name)}</h3><span class="scientific">${escapeHTML(fish.scientific)}</span><span class="card-link">Jelajahi spesies ${icons.arrow}</span></div>
  </a>`;
}

export function renderFishCards(list) {
  return list.map(fishCard).join("");
}

export const galleryState = { query: "", zone: "Semua zona" };

export function renderPage(route) {
  const pages = {
    home: renderHome,
    gallery: renderGallery,
    fish: () => renderDetail(route.id),
    about: renderAbout,
    "not-found": renderNotFound
  };
  return (pages[route.page] || renderNotFound)();
}

function renderHome() {
  return `<section class="hero page-enter">
    <div class="hero-copy"><span class="eyebrow eyebrow-line">EKSPEDISI KE ZONA ABISAL · 00° 00′ N</span>
      <h1>Penghuni<br><em>Kegelapan</em><br>Samudra</h1>
      <p class="hero-intro">Jauh di bawah permukaan, kehidupan menemukan cara untuk bersinar. Selami dunia yang belum banyak terjamah.</p>
      <a class="button button-primary" href="#/gallery">Mulai Menyelam <span>↓</span></a>
      <div class="hero-note"><span class="pulse-dot"></span> EKSPEDISI DIGITAL <span>·</span> 8 SPESIES</div>
    </div>
    <div class="hero-visual" aria-label="Ilustrasi ikan pemancing di laut dalam">
      <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
      <div class="hero-depth-mark">4<span>000</span><small>METERS BELOW</small></div>
      ${fishArt(fishes[0], "hero-fish")}
      <span class="hero-caption">01 / MELANOCETUS JOHNSONII</span><span class="hero-glint glint-one"></span><span class="hero-glint glint-two"></span>
    </div>
    <a class="scroll-cue" href="#/gallery"><span></span> GULIR UNTUK MENYELAM</a>
    <div class="depth-meter"><span id="depth-readout">0 m</span><span class="depth-track"><i></i></span><span>4.000 m</span></div>
  </section>
  <section class="home-preview section-wrap"><div class="section-heading"><div><span class="eyebrow">CATATAN EKSPEDISI · 01</span><h2>Yang tersembunyi<br><em>di bawah ombak.</em></h2></div><a class="text-link" href="#/gallery">Lihat seluruh galeri ${icons.arrow}</a></div>
    <div class="preview-grid">${fishes.slice(0, 3).map(fishCard).join("")}</div></section>`;
}

function renderGallery() {
  const zones = ["Semua zona", "Mesopelagik", "Batipelagik", "Abisopelagik"];
  const query = escapeHTML(galleryState.query);
  return `<section class="page-section page-enter">
    <div class="page-heading"><div><span class="eyebrow">KATALOG SPESIES · 001—008</span><h1>Galeri <em>penghuni.</em></h1></div><p>Temui kehidupan yang beradaptasi dengan gelap, dingin, dan tekanan samudra.</p></div>
    <div class="gallery-toolbar"><label class="search-field"><span class="sr-only">Cari spesies</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><input id="fish-search" type="search" placeholder="Cari nama atau spesies..." value="${query}" autocomplete="off"></label>
      <div class="filter-group" role="group" aria-label="Filter zona kedalaman">${zones.map((zone) => `<button type="button" class="filter-chip${galleryState.zone === zone ? " active" : ""}" data-zone="${zone}" aria-pressed="${galleryState.zone === zone}">${zone}</button>`).join("")}</div></div>
    <div class="gallery-grid" id="gallery-grid">${getFilteredFishes().map(fishCard).join("")}</div>
    <p class="empty-state" id="empty-state"${getFilteredFishes().length ? " hidden" : ""}>Tidak ada spesies yang cocok. Coba kata kunci atau zona lain.</p>
    <div class="gallery-count"><span id="result-count">${getFilteredFishes().length}</span> spesies ditemukan <span class="count-line"></span> KEDALAMAN 200—4.000 M</div>
  </section>`;
}

export function getFilteredFishes() {
  const needle = galleryState.query.trim().toLocaleLowerCase("id");
  return fishes.filter((fish) => (galleryState.zone === "Semua zona" || fish.zone === galleryState.zone) &&
    (!needle || `${fish.name} ${fish.scientific} ${fish.zone}`.toLocaleLowerCase("id").includes(needle)));
}

function renderDetail(id) {
  const index = fishes.findIndex((fish) => fish.id === id);
  if (index < 0) return renderNotFound();
  const fish = fishes[index];
  const previous = fishes[(index - 1 + fishes.length) % fishes.length];
  const next = fishes[(index + 1) % fishes.length];
  return `<section class="detail-page page-enter" style="--fish-glow:${fish.glowColor}">
    <a class="back-link" href="#/gallery">← <span>Kembali ke galeri</span></a>
    <div class="detail-layout"><div class="detail-art-wrap" id="detail-art-wrap"><div class="detail-aura"></div><div class="detail-orbit"></div>${fishArt(fish, "detail-fish")}<span class="detail-image-caption">FIG. ${String(index + 1).padStart(2, "0")} / DEEP OCEAN ARCHIVE</span><span class="detail-depth-stamp">${escapeHTML(fish.zone)}</span></div>
      <article class="detail-copy"><span class="eyebrow">SPESIES ${String(index + 1).padStart(2, "0")} · ${escapeHTML(fish.zone).toUpperCase()}</span><h1>${escapeHTML(fish.name)}</h1><p class="detail-scientific">${escapeHTML(fish.scientific)}</p>
        <p class="detail-description">${escapeHTML(fish.description)}</p>
        <div class="spec-list"><div><span>KEDALAMAN</span><strong>${escapeHTML(fish.depth)}</strong></div><div><span>UKURAN</span><strong>${escapeHTML(fish.size)}</strong></div><div><span>MAKANAN</span><strong>${escapeHTML(fish.diet)}</strong></div></div>
        <div class="adaptations"><span class="eyebrow">ADAPTASI UNIK</span><ul>${fish.adaptations.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
        <blockquote><span>FAKTA MENARIK</span><p>${escapeHTML(fish.funFact)}</p></blockquote>
      </article>
    </div>
    <nav class="detail-pagination" aria-label="Navigasi spesies"><a href="#/fish/${previous.id}"><span>← IKAN SEBELUMNYA</span><b>${escapeHTML(previous.name)}</b></a><span class="pagination-mark">${String(index + 1).padStart(2, "0")} <i>/</i> 08</span><a href="#/fish/${next.id}"><span>IKAN BERIKUTNYA →</span><b>${escapeHTML(next.name)}</b></a></nav>
  </section>`;
}

function renderAbout() {
  return `<section class="page-section about-page page-enter"><div class="about-hero"><span class="eyebrow">CATATAN DARI BAWAH PERMUKAAN</span><h1>Samudra yang<br><em>tak pernah tidur.</em></h1><p>Lebih dari separuh permukaan planet kita adalah laut dalam—rumah bagi kehidupan yang tumbuh dalam kondisi paling ekstrem di Bumi.</p></div>
    <div class="zone-list"><article><span>01 / 200—1.000 M</span><h2>Mesopelagik</h2><p>Zona senja, tempat cahaya matahari meredup hingga tak cukup untuk fotosintesis. Banyak penghuni bermigrasi ke atas pada malam hari.</p></article><article><span>02 / 1.000—4.000 M</span><h2>Batipelagik</h2><p>Kegelapan abadi, suhu mendekati 4°C, dan tekanan yang terus meningkat. Bioluminesensi menjadi sumber cahaya bagi banyak spesies.</p></article><article><span>03 / 4.000—6.000 M</span><h2>Abisopelagik</h2><p>Dataran samudra yang luas dan dingin. Makanan langka, sehingga organisme memanfaatkan setiap sumber energi yang tersedia.</p></article></div>
    <div class="about-note"><span class="eyebrow">KONDISI EKSTREM</span><p>Tekanan bertambah kira-kira satu atmosfer untuk setiap 10 meter kedalaman. Tanpa cahaya matahari, penghuni laut dalam mengandalkan indra khusus, strategi hemat energi, dan cahaya biologis untuk bertahan.</p><a class="button button-outline" href="#/gallery">Temui para penghuni <span>→</span></a></div>
  </section>`;
}

function renderNotFound() {
  return `<section class="not-found page-enter"><span class="eyebrow">SINYALE HILANG DI KEDALAMAN</span><h1>Spesies tidak ditemukan.</h1><a class="button button-primary" href="#/gallery">Kembali ke galeri <span>→</span></a></section>`;
}
