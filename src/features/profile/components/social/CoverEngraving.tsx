import Svg, { Path } from "react-native-svg";

type CoverEngravingProps = {
  width: number;
  height: number;
  color: string;
};

const RIDGES = 6;

/**
 * Mayon's cone drawn as stacked contour lines, like an engraving. Each ridge is
 * the same concave silhouette scaled down from the base, so the lines nest
 * evenly and read as one mountain at any cover width.
 */
const ridgePath = (cx: number, baseY: number, peakY: number, halfBase: number, crater: number) => {
  const rise = baseY - peakY;
  const left = `M${cx - halfBase} ${baseY} C${cx - halfBase * 0.5} ${baseY - rise * 0.16} ${cx - halfBase * 0.14} ${peakY + rise * 0.3} ${cx - crater} ${peakY}`;
  const right = `L${cx + crater} ${peakY} C${cx + halfBase * 0.14} ${peakY + rise * 0.3} ${cx + halfBase * 0.5} ${baseY - rise * 0.16} ${cx + halfBase} ${baseY}`;
  return `${left} ${right}`;
};

const CoverEngraving = ({ width, height, color }: CoverEngravingProps) => {
  const cx = width * (width < 520 ? 0.72 : 0.78);
  const halfBase = Math.min(width * 0.4, height * 2.2);
  const baseY = height + 1;
  const topPeak = height * 0.3;
  const step = (baseY - topPeak) / (RIDGES + 1);

  const ridges = Array.from({ length: RIDGES }, (_, index) => {
    const peakY = topPeak + index * step;
    const scale = (baseY - peakY) / (baseY - topPeak);
    return {
      key: index,
      d: ridgePath(cx, baseY, peakY, halfBase * (0.55 + scale * 0.45), 4 + index * 1.5),
      opacity: 0.45 - index * 0.05,
    };
  });

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {ridges.map((ridge) => (
        <Path
          key={ridge.key}
          d={ridge.d}
          stroke={color}
          strokeOpacity={ridge.opacity}
          strokeWidth={1.25}
          fill="none"
        />
      ))}
    </Svg>
  );
};

export default CoverEngraving;
