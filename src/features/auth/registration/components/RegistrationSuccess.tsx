import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

type RegistrationSuccessProps = {
  email: string;
  onContinue: () => void;
  height: number;
};

const RegistrationSuccess = ({ email, onContinue, height }: RegistrationSuccessProps) => (
  <View style={{ alignItems: "center", gap: 18, paddingVertical: 14, width: "100%" }}>
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEF3C7",
        borderWidth: 2,
        borderColor: "#FDE68A",
      }}
    >
      <Feather name="clock" size={36} color="#D97706" />
    </View>

    <View style={{ alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 21, fontWeight: "800", color: REG_COLORS.heading, letterSpacing: -0.3 }}>
        Registration Submitted
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 16,
          backgroundColor: "#FFFBEB",
          borderWidth: 1,
          borderColor: "#FCD34D",
        }}
      >
        <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#D97706" }} />
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#B45309" }}>
          Status: Pending Verification
        </Text>
      </View>

      <Text
        style={{
          fontSize: 14,
          lineHeight: 22,
          textAlign: "center",
          color: REG_COLORS.muted,
          maxWidth: 420,
          marginTop: 4,
        }}
      >
        Your registration has been successfully submitted. Your account is currently pending verification by the Barangay Administrator.
      </Text>
    </View>

    <View
      style={{
        width: "100%",
        maxWidth: 440,
        borderRadius: REG_RADIUS.card,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        padding: 16,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
        <Feather name="shield" size={17} color={REG_COLORS.primary} style={{ marginTop: 2 }} />
        <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: "#334155" }}>
          You will be able to access MaslogCare once your account has been reviewed and approved.
        </Text>
      </View>

      {email ? (
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center", paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E2E8F0" }}>
          <Feather name="mail" size={14} color="#64748B" />
          <Text style={{ flex: 1, fontSize: 12, color: "#64748B" }}>
            Registered email: <Text style={{ fontWeight: "600", color: "#1E293B" }}>{email}</Text>
          </Text>
        </View>
      ) : null}
    </View>

    <Pressable
      onPress={onContinue}
      accessibilityRole="button"
      accessibilityLabel="Back to Login"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height,
        width: "100%",
        maxWidth: 440,
        borderRadius: REG_RADIUS.control,
        backgroundColor: pressed ? "#1D4ED8" : REG_COLORS.primary,
        boxShadow: "0px 4px 12px rgba(37,99,235,0.25)",
      })}
    >
      <Feather name="log-in" size={16} color={REG_COLORS.surface} />
      <Text style={{ fontSize: 15, fontWeight: "700", color: REG_COLORS.surface }}>
        Back to Login
      </Text>
    </Pressable>
  </View>
);

export default RegistrationSuccess;
