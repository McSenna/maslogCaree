import { useEffect } from "react";
import {
  AppState,
  type AppStateStatus,
  InteractionManager,
  Platform,
} from "react-native";
import { useLatestRef } from "@/hooks/useLatestRef";

export const useAppForegroundLayout = (onForeground?: () => void) => {
  const onForegroundRef = useLatestRef(onForeground);

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
  }, [onForegroundRef]);

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
  }, [onForegroundRef]);
};
