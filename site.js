const RELEASE_REPOSITORY = "SysCake/chroniq-site";
const RELEASE_API = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest`;
const RELEASE_FALLBACK = `https://github.com/${RELEASE_REPOSITORY}/releases/latest`;
const CANONICAL_ASSET = /^Chroniq-(\d+\.\d+\.\d+)-macOS-arm64\.zip$/;
const LEGACY_ASSET = /^Chroniq-(\d+\.\d+\.\d+)\.zip$/;

document.documentElement.classList.add("js");
requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));

const releaseLinks = [...document.querySelectorAll("[data-release-link]")];
const releaseLabels = [...document.querySelectorAll("[data-release-label]")];
const releaseMeta = document.querySelector("[data-release-meta]");

function preferredAsset(assets = []) {
  return (
    assets.find((asset) => CANONICAL_ASSET.test(asset.name)) ??
    assets.find((asset) => LEGACY_ASSET.test(asset.name))
  );
}

async function resolveLatestRelease() {
  try {
    const response = await fetch(RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const release = await response.json();
    const asset = preferredAsset(release.assets);
    if (!asset?.browser_download_url) throw new Error("No supported Chroniq release asset");

    const match = asset.name.match(CANONICAL_ASSET) ?? asset.name.match(LEGACY_ASSET);
    const version = match?.[1] ?? release.tag_name?.replace(/^v/, "");

    releaseLinks.forEach((link) => {
      link.href = asset.browser_download_url;
      link.dataset.releaseResolved = "true";
    });
    releaseLabels.forEach((label) => {
      label.textContent = version ? `Download Chroniq ${version}` : "Download latest release";
    });
    if (releaseMeta && version) {
      releaseMeta.textContent = `Chroniq ${version} · macOS 15+ · Apple silicon · Signed and notarized`;
    }
  } catch (error) {
    releaseLinks.forEach((link) => {
      link.href = RELEASE_FALLBACK;
      link.dataset.releaseResolved = "false";
    });
  }
}

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

resolveLatestRelease();
