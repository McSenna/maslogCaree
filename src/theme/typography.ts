import type { TextStyle } from "react-native";

type TypeStyle = Required<Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">>;

export const TYPE = {
  caption: { fontSize: 14, lineHeight: 18, fontWeight: "500" },
  label: { fontSize: 15, lineHeight: 20, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: "600" },
  bodyLarge: { fontSize: 18, lineHeight: 26, fontWeight: "400" },
  title: { fontSize: 19, lineHeight: 26, fontWeight: "700" },
  headline: { fontSize: 24, lineHeight: 30, fontWeight: "700" },
  display: { fontSize: 30, lineHeight: 36, fontWeight: "800" },
} as const satisfies Record<string, TypeStyle>;

export type TypeToken = keyof typeof TYPE;
