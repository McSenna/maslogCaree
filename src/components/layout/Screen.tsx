import type { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { UI } from "@/design/tokens";

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

export default function Screen({ children, className = "" }: ScreenProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const gutter = isDesktop
    ? UI.screen.gutter.desktop
    : isTablet
      ? UI.screen.gutter.tablet
      : UI.screen.gutter.mobile;

  return (
    <View
      className={["w-full", className].join(" ")}
      style={{
        paddingHorizontal: gutter,
        alignSelf: "center",
        width: "100%",
        maxWidth: isDesktop ? UI.screen.maxWidth : undefined,
      }}
    >
      {children}
    </View>
  );
}

