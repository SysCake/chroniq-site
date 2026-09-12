document.documentElement.classList.add("js");
requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -10%", threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const productStage = document.querySelector("[data-product-stage]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateProductDepth() {
  if (!productStage || reduceMotion.matches || window.innerWidth < 761) return;
  const distance = Math.min(window.scrollY, window.innerHeight);
  productStage.style.translate = `0 ${distance * 0.045}px`;
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProductDepth();
      ticking = false;
    });
  },
  { passive: true },
);



// Preview the application's real appearance without changing the site's palette.
const appearanceButtons = [...document.querySelectorAll("[data-preview-appearance]")];
appearanceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const appearance = button.dataset.previewAppearance;
    if (!["light", "dark"].includes(appearance)) return;
    appearanceButtons.forEach((option) => {
      option.setAttribute("aria-pressed", String(option.dataset.previewAppearance === appearance));
    });
    document.querySelectorAll("[data-screenshot]").forEach((image) => {
      const source = `assets/${image.dataset.screenshot}-${appearance}.png`;
      image.src = source;
      image.closest("a").href = source;
    });
  });
});
