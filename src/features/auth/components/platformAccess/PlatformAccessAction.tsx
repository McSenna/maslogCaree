import { forwardRef } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

const PlatformAccessAction = forwardRef<View, { label: string; onPress: () => void }>(
  ({ label, onPress }, ref) => (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      focusable
      onPress={onPress}
      android_ripple={{ color: "rgba(255,255,255,0.24)" }}
      className="w-full items-center justify-center active:opacity-90"
      style={{
        marginTop: 22,
        height: 50,
        borderRadius: 12,
        backgroundColor: LANDING_COLORS.primaryBlue,
        ...Platform.select({ web: { cursor: "pointer" } }),
      }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: 15.5, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  )
);

PlatformAccessAction.displayName = "PlatformAccessAction";

export default PlatformAccessAction;
