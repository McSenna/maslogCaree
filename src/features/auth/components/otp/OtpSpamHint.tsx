import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

const OtpSpamHint = () => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        paddingHorizontal: SPACING.xl - 4,
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        backgroundColor: colors.surfaceMuted,
      }}
    >
      <Feather name="info" size={14} color={colors.primary} />
      <Text style={[TYPE.caption, { flex: 1, color: colors.body }]}>
        Can&apos;t find the email? Check your spam or junk folder.
      </Text>
    </View>
  );
};

export default OtpSpamHint;
