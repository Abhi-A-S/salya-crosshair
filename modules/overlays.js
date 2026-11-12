import { SELECTORS, OVERLAY_CONFIG } from "./config.js";
import { getActiveCellGeometry, getGridContext } from "./geometry.js";

export function getOverlay(config) {
  let element = document.getElementById(config.id);

  if (!element) {
    element = document.createElement("div");
    element.id = config.id;

    element.style.position = "fixed";
    element.style.pointerEvents = "none";

    document.body.appendChild(element);
  }

  element.style.backgroundColor = config.background;
  element.style.zIndex = config.zIndex;
  element.style.display = "block";

  if (config.border) {
    element.style.border = config.border;
    element.style.boxSizing = "border-box";
  }

  return element;
}

export function positionOverlay(element, bounds) {
  const { left, top, width, height } = bounds;

  if (width <= 0 || height <= 0) {
    element.style.display = "none";
    return;
  }

  element.style.display = "block";
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
}

export function updateOverlay() {
  const borders = document.querySelectorAll(SELECTORS.activeCellBorders);

  if (borders.length !== 4) return;

  const geometry = getActiveCellGeometry(borders);
  if (!geometry) return;

  const context = getGridContext(borders);
  if (!context) return;

  const { gridRect, freezeRect, isFrozenColumn } = context;

  // Determine horizontal clipping boundaries
  const visibleLeft = isFrozenColumn
    ? gridRect.left
    : freezeRect
      ? freezeRect.right
      : gridRect.left;

  const visibleRight = isFrozenColumn ? freezeRect.left : gridRect.right;

  // Get combined vertical boundaries of all grid panes
  const grids = document.querySelectorAll(SELECTORS.grid);

  const gridRects = Array.from(grids, (item) => item.getBoundingClientRect());

  const gridTop = Math.min(...gridRects.map((rect) => rect.top));
  const gridBottom = Math.max(...gridRects.map((rect) => rect.bottom));

  // --------------------------------
  // 1. ROW HIGHLIGHT
  // --------------------------------

  const rowTop = Math.max(geometry.y, gridRect.top);
  const rowBottom = Math.min(geometry.y + geometry.height, gridRect.bottom);

  const rowOverlay = getOverlay(OVERLAY_CONFIG.row);

  positionOverlay(rowOverlay, {
    left: gridRect.left,
    top: rowTop,
    width: gridRect.width,
    height: rowBottom - rowTop,
  });

  // --------------------------------
  // 2. COLUMN HIGHLIGHT
  // --------------------------------

  const columnLeft = Math.max(geometry.x, visibleLeft);
  const columnRight = Math.min(geometry.x + geometry.width, visibleRight);

  const columnOverlay = getOverlay(OVERLAY_CONFIG.column);

  positionOverlay(columnOverlay, {
    left: columnLeft,
    top: gridTop,
    width: columnRight - columnLeft,
    height: gridBottom - gridTop,
  });

  // --------------------------------
  // 3. ACTIVE CELL HIGHLIGHT
  // --------------------------------

  const cellLeft = columnLeft;
  const cellRight = columnRight;

  const cellTop = Math.max(geometry.y, gridRect.top);
  const cellBottom = Math.min(geometry.y + geometry.height, gridRect.bottom);

  const cellOverlay = getOverlay(OVERLAY_CONFIG.cell);

  positionOverlay(cellOverlay, {
    left: cellLeft,
    top: cellTop,
    width: cellRight - cellLeft,
    height: cellBottom - cellTop,
  });
}
