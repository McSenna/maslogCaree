import { useEffect, useLayoutEffect, useRef } from "react";
import { Platform } from "react-native";

const useIsomorphicLayoutEffect = Platform.OS === "web" ? useLayoutEffect : useEffect;

/**
 * Keeps a ref pointing at the latest value (usually a callback) without writing to it during render,
 * so long-lived listeners can call the current handler without re-subscribing.
 */
export const useLatestRef = <T,>(value: T) => {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
