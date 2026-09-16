const PANEL_MAX_HEIGHT = 560;
const EDGE_MARGIN = 16;

const getPanelWidth = (screenWidth: number): number => {
  if (screenWidth >= 1024) return 420;
  if (screenWidth >= 768) return 390;
  return screenWidth - 32;
};

type BellPosition = { x: number; y: number; width: number; height: number } | null | undefined;

export const resolvePanelPlacement = (
  screenWidth: number,
  screenHeight: number,
  bellPosition: BellPosition
) => {
  const panelWidth = getPanelWidth(screenWidth);

  let panelTop = EDGE_MARGIN;
  let panelRight = EDGE_MARGIN;

  if (bellPosition) {
    panelTop = bellPosition.y + bellPosition.height + 8;
    panelRight = screenWidth - (bellPosition.x + bellPosition.width);
  }

  if (panelRight < EDGE_MARGIN) {
    panelRight = EDGE_MARGIN;
  }

  if (screenWidth - panelRight - panelWidth < EDGE_MARGIN) {
    panelRight = screenWidth - panelWidth - EDGE_MARGIN;
  }

  return {
    panelWidth,
    panelTop,
    panelRight,
    maxHeight: Math.min(PANEL_MAX_HEIGHT, screenHeight - panelTop - EDGE_MARGIN * 2),
  };
};

export const notificationDestination = (role?: string): string | null => {
  if (!role) return null;
  if (role === "resident") return "/resident/appointments";
  if (role === "doctor" || role === "admin" || role === "midwife") return `/${role}/mission`;
  return `/${role}/dashboard`;
};
