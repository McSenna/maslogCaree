import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";

const STATS = [
  { value: "10+", label: "Health Workers", icon: "users" as const },
  { value: "24/7", label: "Digital Access", icon: "clock" as const },
  { value: "Free", label: "For Residents", icon: "shield" as const },
] as const;

export default function HeroCard() {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;

  return (
    <View className="overflow-hidden rounded-3xl w-full self-center max-w-2xl shadow-2xl"
      style={{
        boxShadow: "0px 10px 28px rgba(30,58,138,0.28)",
        elevation: 12,
      }}
    >
      <LinearGradient
        colors={["#7988d2", "#5B6FD4", "#3F54BE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Frosted orbs */}
      <View
        className="absolute rounded-full w-[280px] h-[280px] -top-20 -right-20 bg-white/[0.08]"
        style={{ pointerEvents: "none" }}
      />
      <View
        className="absolute rounded-full w-[200px] h-[200px] -bottom-12 -left-10 bg-emerald-500/[0.12]"
        style={{ pointerEvents: "none" }}
      />
      <View
        className="absolute rounded-full w-[120px] h-[120px] top-6 bg-white/[0.06]"
        style={{ left: "42%", marginLeft: -60, pointerEvents: "none" }}
      />

      <View className={`pt-7 pb-7 ${isTablet ? "px-8" : "px-6"}`}>
        {/* Badge */}
        <View className="mb-5 self-start flex-row items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          <Text className="font-bold uppercase tracking-widest text-white/85 text-[9px]">
            Digital Health Platform
          </Text>
        </View>

        {/* Title */}
        <Text
          className={`mb-2 font-black leading-tight text-white tracking-tight ${isTablet ? "text-4xl" : "text-[28px]"}`}
        >
          Welcome to{"\n"}
          <Text className="text-white/70">Maslog </Text>
          <Text className="text-white">Care</Text>
        </Text>

        {/* Subtitle */}
        <Text className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Barangay 61 Maslog
        </Text>

        {/* Description */}
        <Text
          className={`mb-7 mt-4 leading-relaxed text-white/70 ${isTablet ? "text-[15px]" : "text-[13px]"}`}
          style={{ maxWidth: isTablet ? 480 : undefined }}
        >
          Your all-in-one healthcare assistant for the residents of Barangay
          Maslog — accessible, secure, and community-centered.
        </Text>

        {/* Stat Cards */}
        <View className="flex-row gap-2.5">
          {STATS.map((stat) => (
            <View
              key={stat.label}
              className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/20 bg-white/10"
            >
              <View className="items-center px-2 py-3.5">
                <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-white/[0.14]">
                  <Feather
                    name={stat.icon}
                    size={16}
                    color="rgba(255,255,255,0.92)"
                  />
                </View>
                <Text
                  className={`font-black leading-none text-white ${isTablet ? "text-[22px]" : "text-[18px]"}`}
                  style={{
                    textShadowColor: "rgba(0,0,0,0.15)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                  numberOfLines={1}
                >
                  {stat.value}
                </Text>
                <Text
                  className={`mt-1.5 text-center font-semibold leading-tight text-white/65 ${isTablet ? "text-[11px]" : "text-[9px]"}`}
                  numberOfLines={2}
                >
                  {stat.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}