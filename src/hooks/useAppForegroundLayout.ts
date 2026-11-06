import { useEffect } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";
import { useLatestRef } from "@/hooks/useLatestRef";

// React Native 0.88 removed InteractionManager and names requestIdleCallback as
// its replacement. Browsers without it get the next macrotask, which is what
// react-native-web's InteractionManager fell back to.
const runWhenIdle = (task: () => void) => {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => task());
    return;
  }
  setTimeout(task, 0);
};

export const useAppForegroundLayout = (onForeground?: () => void) => {
  const onForegroundRef = useLatestRef(onForeground);

  useEffect(() => {
    const run = () => {
      runWhenIdle(() => {
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
        runWhenIdle(() => {
          onForegroundRef.current?.();
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [onForegroundRef]);
};
