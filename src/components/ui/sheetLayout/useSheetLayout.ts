import { useCallback, useState } from "react";
import { useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  keyboardOverlap,
  reservedEdges,
  sheetBottomInset,
  sheetMaxHeight,
} from "./sheetGeometry";
import { useKeyboardTop } from "./useKeyboardTop";

export type SheetVariant = "sheet" | "centered";

export type SheetLayout = {
  variant: SheetVariant;
  /** Attach to the full-screen view the sheet is laid out in (the modal's root). */
  onContainerLayout: (event: LayoutChangeEvent) => void;
  /** Measured height of that container; the window height until it is laid out. */
  containerHeight: number;
  /** Part of the container the keyboard covers; 0 when the OS already made room. */
  keyboardOverlap: number;
  keyboardVisible: boolean;
  /** Tallest the sheet may be without crossing `insets.top + TOP_SAFE_GAP`. */
  maxHeight: number;
  /** Padding for the sheet's last row (home indicator / nav bar, 0 over the keyboard). */
  bottomInset: number;
  /** Padding the full-screen container reserves above and below the surface. */
  containerPadding: { top: number; bottom: number };
};

type Options = {
  enabled: boolean;
  /** Bottom sheet anchored to the bottom edge, or a card centred in the space left. */
  variant?: SheetVariant;
  /** Optional cap as a share of the visible height, e.g. 0.92 to keep some backdrop. */
  maxHeightRatio?: number;
  /** Minimum distance from the container's edges (desktop dialogs keep 24px). */
  edgePadding?: number;
};

/**
 * The single source of truth for a mobile sheet's geometry: safe-area insets,
 * the keyboard and the container's real size. Every sheet derives its limits
 * from here instead of repeating the arithmetic.
 */
export const useSheetLayout = ({
  enabled,
  variant = "sheet",
  maxHeightRatio = 1,
  edgePadding = 0,
}: Options): SheetLayout => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const keyboardTop = useKeyboardTop(enabled);
  const [frame, setFrame] = useState<{ y: number; height: number } | null>(null);

  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    if (height <= 0) return;
    setFrame((current) =>
      current && Math.abs(current.y - y) < 1 && Math.abs(current.height - height) < 1
        ? current
        : { y, height }
    );
  }, []);

  const containerHeight = frame?.height ?? windowHeight;
  const overlap = keyboardOverlap({
    containerBottom: (frame?.y ?? 0) + containerHeight,
    keyboardTop,
  });
  const keyboardVisible = keyboardTop !== null;
  const bottomInset = sheetBottomInset({ keyboardVisible, insetBottom: insets.bottom });
  const edges = reservedEdges({ variant, insetTop: insets.top, bottomInset, edgePadding });

  return {
    variant,
    onContainerLayout,
    containerHeight,
    keyboardOverlap: overlap,
    keyboardVisible,
    maxHeight: sheetMaxHeight({
      containerHeight,
      overlap,
      reservedTop: edges.top,
      reservedBottom: edges.bottom,
      ratio: maxHeightRatio,
    }),
    bottomInset,
    containerPadding: { top: edges.top, bottom: overlap + edges.bottom },
  };
};
