import { SELECTORS } from "./config.js";
import { updateOverlay } from "./overlays.js";

let activeParent = null;
let activeObserver = null;

function disconnectActiveObserver() {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  activeParent = null;
}

function observeActiveCell() {
  const borders = document.querySelectorAll(SELECTORS.activeCellBorders);

  if (borders.length !== 4) {
    disconnectActiveObserver();
    return;
  }

  const newParent = borders[0].parentElement;

  if (newParent === activeParent) return;

  disconnectActiveObserver();

  activeParent = newParent;

  activeObserver = new MutationObserver(() => {
    updateOverlay();
  });

  activeObserver.observe(activeParent, {
    attributes: true,
    attributeFilter: ["style"],
  });

  updateOverlay();
}

// Detect grid replacements when switching sheets
const rootObserver = new MutationObserver(() => {
  observeActiveCell();
});

let isInitialized = false;

export function initializeCrosshair() {
  if (isInitialized) return;
  isInitialized = true;

  rootObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("scroll", updateOverlay, true);
  window.addEventListener("resize", updateOverlay);

  observeActiveCell();
}
