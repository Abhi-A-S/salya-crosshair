function getActiveCellGeometry() {
  const borders = document.querySelectorAll(".range-border.active-cell-border");

  if (borders.length !== 4) {
    return null;
  }

  const parent = borders[0].parentElement;
  const container = parent.offsetParent;

  const x = container.getBoundingClientRect().x + parent.offsetLeft;
  const y = container.getBoundingClientRect().y + parent.offsetTop;

  const width = borders[0].offsetWidth;
  const height = borders[3].offsetHeight;

  return { x, y, width, height };
}

function updateOverlay() {
  const geometry = getActiveCellGeometry();

  if (!geometry) return;

  const borders = document.querySelectorAll(".range-border.active-cell-border");

  const grid = borders[0].closest(".grid-table-container");
  if (!grid) return;

  const gridRect = grid.getBoundingClientRect();

  // Find frozen column boundary
  const freezeHandle = document.querySelector(".freezebar-vertical-handle");

  const freezeRect = freezeHandle ? freezeHandle.getBoundingClientRect() : null;

  // Determine whether the active cell belongs to frozen columns
  const cellPane = borders[0].closest(".grid4-inner-container");

  const isFrozenColumn =
    !!freezeRect &&
    cellPane &&
    cellPane.getBoundingClientRect().left < freezeRect.left;

  // Determine horizontal clipping boundaries
  const visibleLeft = isFrozenColumn
    ? gridRect.left
    : freezeRect
      ? freezeRect.right
      : gridRect.left;

  const visibleRight = isFrozenColumn ? freezeRect.left : gridRect.right;

  // Get combined vertical boundaries of all grid panes
  const grids = document.querySelectorAll(".grid-table-container");

  const gridRects = Array.from(grids, (item) => item.getBoundingClientRect());

  const gridTop = Math.min(...gridRects.map((rect) => rect.top));
  const gridBottom = Math.max(...gridRects.map((rect) => rect.bottom));

  // Helper to create or retrieve overlays
  function getOverlay(id, background, zIndex) {
    let element = document.getElementById(id);

    if (!element) {
      element = document.createElement("div");
      element.id = id;

      element.style.position = "fixed";
      element.style.backgroundColor = background;
      element.style.pointerEvents = "none";
      element.style.zIndex = zIndex;

      document.body.appendChild(element);
    }

    element.style.display = "block";

    return element;
  }

  // --------------------------------
  // 1. ROW HIGHLIGHT
  // --------------------------------

  const rowTop = Math.max(geometry.y, gridRect.top);
  const rowBottom = Math.min(geometry.y + geometry.height, gridRect.bottom);

  const rowOverlay = getOverlay(
    "salya-row-overlay",
    "rgba(0, 150, 255, 0.08)",
    "999998",
  );

  if (rowBottom <= rowTop) {
    rowOverlay.style.display = "none";
  } else {
    rowOverlay.style.left = `${gridRect.left}px`;
    rowOverlay.style.top = `${rowTop}px`;
    rowOverlay.style.width = `${gridRect.width}px`;
    rowOverlay.style.height = `${rowBottom - rowTop}px`;
  }

  // --------------------------------
  // 2. COLUMN HIGHLIGHT
  // --------------------------------

  const columnLeft = Math.max(geometry.x, visibleLeft);
  const columnRight = Math.min(geometry.x + geometry.width, visibleRight);

  const columnOverlay = getOverlay(
    "salya-column-overlay",
    "rgba(0, 150, 255, 0.08)",
    "999998",
  );

  if (columnRight <= columnLeft) {
    columnOverlay.style.display = "none";
  } else {
    columnOverlay.style.left = `${columnLeft}px`;
    columnOverlay.style.top = `${gridTop}px`;
    columnOverlay.style.width = `${columnRight - columnLeft}px`;
    columnOverlay.style.height = `${gridBottom - gridTop}px`;
  }

  // --------------------------------
  // 3. ACTIVE CELL HIGHLIGHT
  // --------------------------------

  const cellLeft = columnLeft;
  const cellRight = columnRight;

  const cellTop = Math.max(geometry.y, gridRect.top);
  const cellBottom = Math.min(geometry.y + geometry.height, gridRect.bottom);

  const cellOverlay = getOverlay(
    "salya-crosshair-test",
    "rgba(0, 150, 255, 0.15)",
    "999999",
  );

  cellOverlay.style.border = "2px solid #0096ff";
  cellOverlay.style.boxSizing = "border-box";

  if (cellRight <= cellLeft || cellBottom <= cellTop) {
    cellOverlay.style.display = "none";
  } else {
    cellOverlay.style.left = `${cellLeft}px`;
    cellOverlay.style.top = `${cellTop}px`;
    cellOverlay.style.width = `${cellRight - cellLeft}px`;
    cellOverlay.style.height = `${cellBottom - cellTop}px`;
  }
}

let activeParent = null;
let activeObserver = null;

function observeActiveCell() {
  const borders = document.querySelectorAll(".range-border.active-cell-border");

  if (borders.length !== 4) return;

  const newParent = borders[0].parentElement;

  if (newParent === activeParent) return;

  if (activeObserver) {
    activeObserver.disconnect();
  }

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

rootObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Handle scrolling and resizing
window.addEventListener("scroll", updateOverlay, true);
window.addEventListener("resize", updateOverlay);

// Initial setup
observeActiveCell();
