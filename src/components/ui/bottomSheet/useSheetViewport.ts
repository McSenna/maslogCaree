import { useCallback, useState } from "react";

type SheetViewport = {
  onContainerLayout: (height: number) => void;
  availableHeight: number;
  keyboardGap: number;
  systemAlreadyResized: boolean;
};

const SHRINK_TOLERANCE = 0.5;
const KEYBOARD_MIN_THRESHOLD = 100;

export const useSheetViewport = (
  keyboardInset: number,
  fallbackHeight: number
): SheetViewport => {
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [restingHeight, setRestingHeight] = useState(fallbackHeight);
  const [prevFallbackHeight, setPrevFallbackHeight] = useState(fallbackHeight);

  if (fallbackHeight !== prevFallbackHeight) {
    setPrevFallbackHeight(fallbackHeight);
    setRestingHeight(fallbackHeight);
  }

  const onContainerLayout = useCallback((height: number) => {
    if (height <= 0) return;

    setMeasuredHeight((current) => (Math.abs(current - height) < 1 ? current : height));
    setRestingHeight((current) => (height >= current - 50 ? Math.max(current, height) : current));
  }, []);

  const availableHeight = measuredHeight > 0 ? measuredHeight : fallbackHeight;
  const baselineHeight = Math.max(restingHeight, fallbackHeight);
  const heightDrop = baselineHeight - availableHeight;

  const systemAlreadyResized =
    heightDrop >= (keyboardInset > 0 ? keyboardInset * SHRINK_TOLERANCE : KEYBOARD_MIN_THRESHOLD);

  const keyboardGap = keyboardInset > 0 && !systemAlreadyResized ? keyboardInset : 0;

  return {
    onContainerLayout,
    availableHeight,
    keyboardGap,
    systemAlreadyResized,
  };
};
