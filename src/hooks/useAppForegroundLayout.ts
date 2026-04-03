import { useEffect, useRef } from "react";
import {
  AppState,
  type AppStateStatus,
  InteractionManager,
  Platform,
} from "react-native";

/**
  Recalculates layout on foreground return to prevent stale measurements without remounting or resetting scroll.
 */
export function useAppForegroundLayout(onForeground?: () => void) {
  const onForegroundRef = useRef(onForeground);
  onForegroundRef.current = onForeground;

  useEffect(() => {
    const run = () => {
      InteractionManager.runAfterInteractions(() => {
        onForegroundRef.current?.();
      });
    };

    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active") run();
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        InteractionManager.runAfterInteractions(() => {
          onForegroundRef.current?.();
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
}
