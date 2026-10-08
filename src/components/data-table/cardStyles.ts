import { StyleSheet } from "react-native";

import { RADII } from "@/theme/radius";

export const cardStyles = StyleSheet.create({
  list: { gap: 12 },
  card: { borderWidth: 1, borderRadius: RADII.medium, padding: 16 },
  plain: { paddingVertical: 12 },
});
