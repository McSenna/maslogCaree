import type { TextStyle } from "react-native";

type TypeStyle = Required<Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">>;

export const TYPE = {
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  body: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  bodyStrong: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  title: { fontSize: 17, lineHeight: 24, fontWeight: "700" },
  headline: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  display: { fontSize: 28, lineHeight: 34, fontWeight: "800" },
} as const satisfies Record<string, TypeStyle>;

export type TypeToken = keyof typeof TYPE;
