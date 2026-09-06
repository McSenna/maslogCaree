import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { LANDING_COLORS } from "@/config/landingAssets";

interface FeatureIconProps {
  size?: number;
  color?: string;
}

/**
 * Calendar with clock badge icon matching the "Book Appointments" reference.
 */
export function AppointmentCalendarIcon({
  size = 24,
  color = LANDING_COLORS.primaryBlue,
}: FeatureIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Top pins */}
      <Path
        d="M15 8V14M33 8V14"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Calendar body */}
      <Path
        d="M38 18H10C8.34315 18 7 19.3431 7 21V38C7 39.6569 8.34315 41 10 41H24"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M41 21V28"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M7 25H41"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Clock badge */}
      <Circle
        cx={34}
        cy={34}
        r={7.5}
        stroke={color}
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M34 30.5V34L37.5 35.8"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Stethoscope icon matching the "Access Health Services" reference.
 */
export function StethoscopeIcon({
  size = 24,
  color = LANDING_COLORS.green,
}: FeatureIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Earpieces */}
      <Circle cx={15} cy={14} r={2} fill={color} />
      <Circle cx={27} cy={14} r={2} fill={color} />
      {/* Head tube */}
      <Path
        d="M15 15V22C15 25.3137 17.6863 28 21 28C24.3137 28 27 25.3137 27 22V15"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Lower tube to chest piece */}
      <Path
        d="M21 28V31C21 35.4183 24.5817 39 29 39C33.4183 39 37 35.4183 37 31"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Chest piece */}
      <Circle
        cx={37}
        cy={31}
        r={3.5}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
      />
    </Svg>
  );
}

/**
 * Bell icon matching the "Stay Updated" reference.
 */
export function NotificationBellIcon({
  size = 24,
  color = LANDING_COLORS.orange,
}: FeatureIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Top hanger loop */}
      <Path
        d="M21 13C21 11.3431 22.3431 10 24 10C25.6569 10 27 11.3431 27 13"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Bell body */}
      <Path
        d="M24 13C17 19 16 29 12 34H36C32 29 31 19 24 13Z"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Clapper */}
      <Circle cx={24} cy={38.5} r={2.5} fill={color} />
    </Svg>
  );
}
