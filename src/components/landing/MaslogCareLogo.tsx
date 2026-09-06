import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { LANDING_COLORS } from "@/config/landingAssets";

interface MaslogCareLogoProps {
  size?: number;
  color?: string;
}

/**
 * Dedicated MaslogCare Heart Vector Logo.
 *
 * Recreates the healthcare heart with two people figures and cradling
 * wing arcs from the approved Figma/reference design.
 */
export default function MaslogCareLogo({
  size = 72,
  color = LANDING_COLORS.primaryBlue,
}: MaslogCareLogoProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      accessibilityLabel="MaslogCare Heart Logo"
    >
      {/* Heart outline */}
      <Path
        d="M60 36 C53 24 30 22 27 42 C25 59 44 76 60 89 C76 76 95 59 93 42 C90 22 67 24 60 36 Z"
        stroke={color}
        strokeWidth={6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer cradle wings */}
      <Path
        d="M16 67 C20 64 27 71 37 80 L60 101 L83 80 C93 71 100 64 104 67"
        stroke={color}
        strokeWidth={6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Two people heads */}
      <Circle cx={48} cy={52} r={6.5} fill={color} />
      <Circle cx={72} cy={52} r={6.5} fill={color} />

      {/* Left body / shoulder */}
      <Path
        d="M37 74 C38 62 57 62 58 75 L58 81"
        stroke={color}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right body / shoulder */}
      <Path
        d="M83 74 C82 62 63 62 62 75 L62 81"
        stroke={color}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
