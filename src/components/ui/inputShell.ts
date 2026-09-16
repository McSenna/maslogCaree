import { Platform } from "react-native";

export const INPUT_SHELL_PROPS =
  Platform.OS === "web" ? ({ dataSet: { inputShell: "true" } } as object) : {};
