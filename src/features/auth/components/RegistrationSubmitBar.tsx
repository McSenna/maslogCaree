import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type RegistrationSubmitBarProps = {
  isLoading: boolean;
  onSubmit: () => void;
};

/** The pinned Create Account action and the terms line beneath it. */
export default function RegistrationSubmitBar({
  isLoading,
  onSubmit,
}: RegistrationSubmitBarProps) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === "ios" ? 34 : 24,
        boxShadow: "0px -4px 12px rgba(0,0,0,0.08)",
        elevation: 8,
      }}
    >
      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityState={{ disabled: isLoading, busy: isLoading }}
        style={({ pressed }) => ({
          width: "100%",
          height: 60,
          borderRadius: 16,
          overflow: "hidden",
          opacity: isLoading ? 0.85 : pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <LinearGradient
          colors={["#3B5BDB", "#5B3BDB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderRadius: 16,
          }}
        >
          <Feather name={isLoading ? "loader" : "user-plus"} size={20} color="#fff" />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff", letterSpacing: 0.3 }}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Text>
        </LinearGradient>
      </Pressable>

      <Text
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#94A3B8",
          lineHeight: 16,
          marginTop: 14,
        }}
      >
        By registering, you agree to our{" "}
        <Text style={{ color: "#3B5BDB", fontWeight: "500" }}>Terms</Text>
        {" and "}
        <Text style={{ color: "#3B5BDB", fontWeight: "500" }}>Privacy Policy</Text>
      </Text>
    </View>
  );
}
