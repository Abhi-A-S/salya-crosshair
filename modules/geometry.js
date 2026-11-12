import { SELECTORS } from "./config.js";

export function getActiveCellGeometry(borders) {
  if (borders.length !== 4) {
    return null;
  }

  const parent = borders[0].parentElement;
  const container = parent.offsetParent;

  if (!container) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();

  return {
    x: containerRect.x + parent.offsetLeft,
    y: containerRect.y + parent.offsetTop,
    width: borders[0].offsetWidth,
    height: borders[3].offsetHeight,
  };
}

export function getGridContext(borders) {
  if (borders.length !== 4) {
    return null;
  }

  const activeBorder = borders[0];

  const grid = activeBorder.closest(SELECTORS.grid);
  const cellPane = activeBorder.closest(SELECTORS.cellPane);
  const freezeHandle = document.querySelector(SELECTORS.freezeHandle);

  if (!grid) {
    return null;
  }

  const gridRect = grid.getBoundingClientRect();
  const freezeRect = freezeHandle ? freezeHandle.getBoundingClientRect() : null;

  const isFrozenColumn =
    !!freezeRect &&
    !!cellPane &&
    cellPane.getBoundingClientRect().left < freezeRect.left;

  return {
    gridRect,
    freezeRect,
    isFrozenColumn,
  };
}
