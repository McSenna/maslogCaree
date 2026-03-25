import { View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileBannerProps = {
  height?: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileBanner({ height = 80 }: ProfileBannerProps) {
  return (
    <View
      className="w-full overflow-hidden rounded-t-3xl"
      style={{ height, backgroundColor: "#c5dbf0" }}
    >
      {/* Cloud 1 — large left */}
      <View
        className="absolute rounded-full bg-white/80"
        style={{ left: "10%", top: "15%", width: 88, height: 44 }}
      />
      {/* Cloud 2 — small left top */}
      <View
        className="absolute rounded-full bg-white/65"
        style={{ left: "24%", top: "5%", width: 52, height: 32 }}
      />
      {/* Cloud 3 — right */}
      <View
        className="absolute rounded-full bg-white/50"
        style={{ right: "12%", top: "22%", width: 66, height: 34 }}
      />
    </View>
  );
}