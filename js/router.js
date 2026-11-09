export function getRoute() {
  const hash = window.location.hash || "#/";
  if (hash === "#/" || hash === "#") return { page: "home" };
  if (hash === "#/gallery") return { page: "gallery" };
  if (hash === "#/about") return { page: "about" };
  const match = hash.match(/^#\/fish\/([a-z0-9-]+)$/i);
  if (match) return { page: "fish", id: match[1] };
  return { page: "not-found" };
}

export function navigate(path) {
  const next = `#${path}`;
  if (window.location.hash === next) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else window.location.hash = next;
}
