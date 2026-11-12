export const SELECTORS = {
  activeCellBorders: ".range-border.active-cell-border",
  grid: ".grid-table-container",
  freezeHandle: ".freezebar-vertical-handle",
  cellPane: ".grid4-inner-container",
};

export const OVERLAY_CONFIG = {
  row: {
    id: "salya-row-overlay",
    background: "rgba(0, 150, 255, 0.08)",
    zIndex: 999998,
  },
  column: {
    id: "salya-column-overlay",
    background: "rgba(0, 150, 255, 0.08)",
    zIndex: 999998,
  },
  cell: {
    id: "salya-cell-overlay",
    background: "rgba(0, 150, 255, 0.15)",
    border: "2px solid #0096ff",
    zIndex: 999999,
  },
};
