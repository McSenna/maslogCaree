import { RADIUS } from "../inventoryTheme";
import { createShadow } from "@/design/shadow";

type SurfaceInput = {
  isMobile: boolean;
  /** From the shared sheet layout: already below the status bar and above the keyboard. */
  maxHeight: number;
  cardBg: string;
  cardBorder: string;
};

export const inventoryModalSurface = ({
  isMobile,
  maxHeight,
  cardBg,
  cardBorder,
}: SurfaceInput) =>
  isMobile
    ? {
        maxHeight,
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
        maxHeight,
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
