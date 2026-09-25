import { StyleSheet } from "react-native";
import { webStyle } from "@/theme/webStyle";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  desktopRoot: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#F2F7FD",
    ...webStyle({
        height: "100dvh",
        minHeight: "100vh",
        overflowX: "hidden",
      }),
  },
  desktopFrame: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  desktopContentContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "auto",
  },
  desktopLeftColumn: {
    flex: 1,
    minWidth: 0,
  },
  desktopRightColumn: {
    flexShrink: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  desktopAuthAnchor: {
    maxWidth: "100%",
    alignItems: "flex-end",
    position: "relative",
  },

  mobileRoot: {
    flex: 1,
    ...webStyle({
        height: "100dvh",
        overflow: "hidden",
      }),
  },
  mobileHeroSection: {
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mobileContent: {
    flexGrow: 1,
  },
  mobileBrandWrapper: {
    zIndex: 2,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mobileCardWrapper: {
    zIndex: 3,
    flexShrink: 0,
  },
});
