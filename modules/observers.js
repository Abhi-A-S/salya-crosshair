import { SELECTORS } from "./config.js";
import { updateOverlay } from "./overlays.js";

let activeParent = null;
let activeObserver = null;
let activeResizeObserver = null;

function disconnectActiveObserver() {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  if (activeResizeObserver) {
    activeResizeObserver.disconnect();
    activeResizeObserver = null;
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

  activeResizeObserver = new ResizeObserver(() => {
    updateOverlay();
  });

  borders.forEach((border) => {
    activeResizeObserver.observe(border);
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
