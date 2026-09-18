import { RADIUS } from "../inventoryTheme";
import { createShadow } from "@/design/shadow";

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
        ...createShadow({
          color: "#0F2557",
          offsetY: -6,
          radius: 24,
          opacity: 0.2,
          elevation: 16,
        }),
      }
    : {
        maxWidth: 460,
        maxHeight: height * 0.88,
        borderRadius: RADIUS.card,
        backgroundColor: cardBg,
        borderColor: cardBorder,
        ...createShadow({
          color: "#0F2557",
          offsetY: 12,
          radius: 28,
          opacity: 0.18,
          elevation: 12,
        }),
      };
