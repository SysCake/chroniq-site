document.documentElement.classList.add("js");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8%", threshold: 0.06 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Show every screenshot in the chosen app appearance. The site's own palette
// does not change; the static default is dark and works without JavaScript.
const appearanceButtons = [...document.querySelectorAll("[data-preview-appearance]")];
function showAppearance(appearance) {
  if (!["light", "dark"].includes(appearance)) return;
  appearanceButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.previewAppearance === appearance));
  });
  document.querySelectorAll("[data-screenshot]").forEach((image) => {
    const source = `assets/${image.dataset.screenshot}-${appearance}.png`;
    image.src = source;
    image.closest("a").href = source;
  });
}
appearanceButtons.forEach((button) => {
  button.addEventListener("click", () => showAppearance(button.dataset.previewAppearance));
});
