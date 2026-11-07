import type { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { Platform } from "react-native";

export type FloatingAction = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
};

type SetFloatingAction = (action: FloatingAction | null) => void;

/** Provided by RoleLayout, which draws the button beside the bottom navigation. */
export const FloatingActionContext = createContext<SetFloatingAction | null>(null);

const useIsomorphicLayoutEffect = Platform.OS === "web" ? useLayoutEffect : useEffect;

/**
 * Asks the role layout to show a floating action button on phones while this
 * screen is focused; `null`, leaving the screen, or a screen pushed on top
 * removes it (the stack keeps covered screens mounted). The latest `onPress`
 * is always the one called, without re-registering on every render.
 */
export const useFloatingAction = (action: FloatingAction | null) => {
  const setAction = useContext(FloatingActionContext);
  const onPressRef = useRef(action?.onPress);
  const active = Boolean(action);
  const icon = action?.icon;
  const label = action?.label;

  useIsomorphicLayoutEffect(() => {
    onPressRef.current = action?.onPress;
  });

  useFocusEffect(
    useCallback(() => {
      if (!setAction || !active || !icon || !label) return undefined;
      setAction({ icon, label, onPress: () => onPressRef.current?.() });
      return () => setAction(null);
    }, [setAction, active, icon, label])
  );
};
