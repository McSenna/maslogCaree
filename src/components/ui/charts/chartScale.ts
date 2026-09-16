const NICE_STEPS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 10];

export const niceCeiling = (value: number, divisions = 5): number => {
  if (value <= divisions) return divisions;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of NICE_STEPS) {
    const candidate = step * magnitude;
    if (candidate >= value && Number.isInteger(candidate / divisions)) return candidate;
  }
  return Math.ceil(value / divisions) * divisions;
};

type Point = { x: number; y: number };

export const monotonePath = (points: Point[]): string => {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M ${points[0].x} ${points[0].y}`;
  if (n === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const h = points[i + 1].x - points[i].x;
    dx.push(h);
    slope.push(h === 0 ? 0 : (points[i + 1].y - points[i].y) / h);
  }

  const tangent: number[] = new Array(n);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangent[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tangent[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d +=
      ` C ${points[i].x + h},${points[i].y + tangent[i] * h}` +
      ` ${points[i + 1].x - h},${points[i + 1].y - tangent[i + 1] * h}` +
      ` ${points[i + 1].x},${points[i + 1].y}`;
  }
  return d;
};
