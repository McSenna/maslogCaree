import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { RegistrationStatus } from "@/services/auth";
import { PALETTE, withAlpha } from "@/theme/palette";

import { REG_COLORS, REG_RADIUS } from "../registrationTheme";
import { REGISTRATION_SUCCESS_CONTENT } from "./registrationSuccessContent";

type RegistrationSuccessProps = {
  email: string;
  status: RegistrationStatus;
  onContinue: () => void;
  height: number;
};

const RegistrationSuccess = ({ email, status, onContinue, height }: RegistrationSuccessProps) => {
  const content = REGISTRATION_SUCCESS_CONTENT[status];
  const { tone } = content;

  return (
    <View style={{ alignItems: "center", gap: 18, paddingVertical: 14, width: "100%" }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tone.well,
          borderWidth: 2,
          borderColor: tone.wellBorder,
        }}
      >
        <Feather name={content.icon} size={36} color={tone.icon} />
      </View>

      <View style={{ alignItems: "center", gap: 8 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 21, fontWeight: "800", color: REG_COLORS.heading, letterSpacing: -0.3 }}
        >
          {content.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 16,
            backgroundColor: tone.badgeBg,
            borderWidth: 1,
            borderColor: tone.badgeBorder,
          }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: tone.icon }} />
          <Text style={{ fontSize: 12, fontWeight: "700", color: tone.text }}>{content.badge}</Text>
        </View>

        <Text
          accessibilityLiveRegion="polite"
          style={{
            fontSize: 14,
            lineHeight: 22,
            textAlign: "center",
            color: REG_COLORS.muted,
            maxWidth: 420,
            marginTop: 4,
          }}
        >
          {content.body}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: REG_RADIUS.card,
          borderWidth: 1,
          borderColor: PALETTE.slate[200],
          backgroundColor: PALETTE.slate[50],
          padding: 16,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
          <Feather name="shield" size={17} color={REG_COLORS.primary} style={{ marginTop: 2 }} />
          <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: PALETTE.slate[700] }}>
            {content.note}
          </Text>
        </View>

        {email ? (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", paddingTop: 8, borderTopWidth: 1, borderTopColor: PALETTE.slate[200] }}>
            <Feather name="mail" size={14} color={PALETTE.slate[500]} />
            <Text style={{ flex: 1, fontSize: 12, color: PALETTE.slate[500] }}>
              Registered email: <Text style={{ fontWeight: "600", color: PALETTE.slate[800] }}>{email}</Text>
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel={content.action}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height,
          width: "100%",
          maxWidth: 440,
          borderRadius: REG_RADIUS.control,
          backgroundColor: pressed ? PALETTE.blue[700] : REG_COLORS.primary,
          boxShadow: `0px 4px 12px ${withAlpha(PALETTE.blue[600], 0.25)}`,
        })}
      >
        <Feather name="log-in" size={16} color={REG_COLORS.surface} />
        <Text style={{ fontSize: 15, fontWeight: "700", color: REG_COLORS.surface }}>
          {content.action}
        </Text>
      </Pressable>
    </View>
  );
};

export default RegistrationSuccess;
