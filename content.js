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

  let overlay = document.getElementById("salya-crosshair-test");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "salya-crosshair-test";

    overlay.style.position = "fixed";
    overlay.style.backgroundColor = "rgba(0, 150, 255, 0.15)";
    overlay.style.border = "2px solid #0096ff";
    overlay.style.boxSizing = "border-box";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "999999";

    document.body.appendChild(overlay);
  }

  overlay.style.left = `${geometry.x}px`;
  overlay.style.top = `${geometry.y}px`;
  overlay.style.width = `${geometry.width}px`;
  overlay.style.height = `${geometry.height}px`;
}

// Initial update
setInterval(updateOverlay, 100);
