import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  desktopRoot: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F2F7FD",
    ...Platform.select({
      web: {
        minHeight: "100vh",
        overflowX: "hidden",
      } as any,
    }),
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
    width: "57%",
    gap: 26,
    paddingRight: 40,
  },
  desktopRightColumn: {
    width: "43%",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  mobileRoot: {
    flex: 1,
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
