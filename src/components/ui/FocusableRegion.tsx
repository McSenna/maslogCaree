import { useState, type ReactNode } from "react";
import { Platform, View, type ViewProps } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type FocusEventLike = { target: unknown; currentTarget: unknown };

const isKeyboardFocusOnSelf = (event: FocusEventLike): boolean => {
  if (event.target !== event.currentTarget) return false;
  const target = event.target as { matches?: (selector: string) => boolean };
  return target.matches?.(":focus-visible") ?? false;
};

/**
 * Read-only content in a scrolling dialog has no controls, so without a tab stop
 * a keyboard could never reach it to scroll. A focused child must not light the ring.
 */
const FocusableRegion = ({ children, ...view }: ViewProps & { children: ReactNode }) => {
  const palette = useAdminSurfacePalette();
  const [ringed, setRinged] = useState(false);
  const web =
    Platform.OS === "web"
      ? {
          tabIndex: 0 as const,
          onFocus: (event: FocusEventLike) => setRinged(isKeyboardFocusOnSelf(event)),
          onBlur: () => setRinged(false),
        }
      : {};
  return (
    <View {...view} {...web} style={ringed ? focusRing(palette.focusRing, 2) : null}>
      {children}
    </View>
  );
};

export default FocusableRegion;
