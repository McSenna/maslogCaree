export const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return `rgba(0,0,0,${alpha})`;

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
};
