import { useEffect, useRef } from "react";
import type { ScrollView } from "react-native";

/** Moves the shell's body when `key` changes. Key 0 is the resting state, so opening never scrolls. */
export const useShellScrollRequest = (key = 0, y = 0) => {
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (key) scrollRef.current?.scrollTo({ y, animated: false });
  }, [key, y]);
  return scrollRef;
};
