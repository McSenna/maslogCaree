import { useMemo } from "react";

import { monotonePath, niceCeiling } from "../chartScale";
import type { LineSeries } from "./lineChartTypes";

export const PAD_X = 8;
export const PAD_LEFT_AXIS = 34;
export const PAD_TOP = 12;
export const PAD_BOTTOM = 20;
export const LEGEND_H = 24;
export const TICKS = 5;
export const END_DOT_R = 4;

type GeometryInput = {
  series: LineSeries[];
  innerH: number;
  innerW: number;
  padLeft: number;
  axisY: number;
  baselineAtZero: boolean;
};

export const useLineChartGeometry = ({
  series,
  innerH,
  innerW,
  padLeft,
  axisY,
  baselineAtZero,
}: GeometryInput) =>
  useMemo(() => {
    const all = series.flatMap((s) => s.values.filter(Number.isFinite));
    const rawMax = Math.max(1, ...all);
    const rawMin = Math.min(0, ...all);

    const maxV = baselineAtZero ? niceCeiling(rawMax) : rawMax + (rawMax - rawMin || 1) * 0.1;
    const minV = baselineAtZero ? 0 : rawMin - (rawMax - rawMin || 1) * 0.1;
    const range = maxV - minV || 1;

    const count = Math.max(2, ...series.map((s) => s.values.length));
    const stepX = innerW / (count - 1);

    const toXY = (v: number, i: number) => ({
      x: padLeft + i * stepX,
      y: PAD_TOP + innerH - ((v - minV) / range) * innerH,
    });

    const lines = series.map((s) => ({
      points: s.values.map((v, i) => toXY(Number.isFinite(v) ? v : 0, i)),
      color: s.color,
      dashed: s.dashed,
      label: s.label,
    }));

    const areas = series
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => s.showArea)
      .map(({ idx }) => {
        const pts = lines[idx].points;
        if (pts.length < 2) return { d: "", gradientIndex: idx };
        return {
          d: `${monotonePath(pts)} L ${pts[pts.length - 1].x},${axisY} L ${pts[0].x},${axisY} Z`,
          gradientIndex: idx,
        };
      });

    return {
      polylines: lines.map((l) => ({ ...l, d: monotonePath(l.points) })),
      areaPaths: areas,
      pointXs: Array.from({ length: count }, (_, i) => padLeft + i * stepX),
      step: stepX,
      axisMax: maxV,
    };
  }, [series, innerH, innerW, padLeft, axisY, baselineAtZero]);

export type LineChartGeometry = ReturnType<typeof useLineChartGeometry>;
