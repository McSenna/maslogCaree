import { RADIUS } from "../inventoryTheme";

type SurfaceInput = {
  isMobile: boolean;
  height: number;
  cardBg: string;
  cardBorder: string;
};

export const inventoryModalSurface = ({
  isMobile,
  height,
  cardBg,
  cardBorder,
}: SurfaceInput) =>
  isMobile
    ? {
        maxHeight: height * 0.92,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: cardBg,
        shadowColor: "#0F2557",
        shadowOpacity: 0.2,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -6 },
        elevation: 16,
      }
    : {
        maxWidth: 460,
        maxHeight: height * 0.88,
        borderRadius: RADIUS.card,
        backgroundColor: cardBg,
        borderColor: cardBorder,
        shadowColor: "#0F2557",
        shadowOpacity: 0.18,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
      };
