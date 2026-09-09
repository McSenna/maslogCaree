import type { ReactNode } from "react";
import { View } from "react-native";
import { CARD, CARD_SHADOW, RESIDENT_COLORS } from "./residentTheme";

type DashboardCardProps = {
  children: ReactNode;
  /** Sections that paint their own inner padding opt out of the default. */
  padded?: boolean;
  className?: string;
};

/**
 * The white surface every dashboard section sits on: thin blue-grey border,
 * very soft shadow, 16px radius — the design's lightweight card, declared once.
 */
const DashboardCard = ({ children, padded = true, className = "" }: DashboardCardProps) => (
  <View
    className={`w-full overflow-hidden border ${padded ? "p-4" : ""} ${className}`}
    style={{
      borderRadius: CARD.radius,
      backgroundColor: RESIDENT_COLORS.cardBg,
      borderColor: RESIDENT_COLORS.border,
      ...CARD_SHADOW,
    }}
  >
    {children}
  </View>
);

export default DashboardCard;
