import { Feather } from "@expo/vector-icons";
import { Text, View, useWindowDimensions } from "react-native";

const STATS = [
  { value: "10+", label: "Health Workers", icon: "users" as const },
  { value: "24/7", label: "Digital Access", icon: "clock" as const },
  { value: "Free", label: "For Residents", icon: "shield" as const },
] as const;

export default function HeroCard() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View
      className="overflow-hidden rounded-3xl"
      style={{
        backgroundColor: "#7988d2",
        shadowColor: "#2D5BFF",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 10,
        maxWidth: 640,
        alignSelf: "center",
        width: "100%",
      }}
    >
      {/* Decorative circles — fixed positions to avoid shift */}
      <View
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          top: -80,
          right: -80,
          backgroundColor: "rgba(45,91,255,0.15)",
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          bottom: -40,
          left: -30,
          backgroundColor: "rgba(16,185,129,0.12)",
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          top: 20,
          left: "45%",
          marginLeft: -30,
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      />

      <View
        className="px-6 pt-7 pb-7"
        style={{ paddingHorizontal: isTablet ? 32 : 24 }}
      >
        <View className="mb-5 self-start flex-row items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <Text
            className="font-bold uppercase tracking-widest text-white/75"
            style={{ fontSize: 9 }}
          >
            Digital Health Platform
          </Text>
        </View>

        <Text
          className="mb-3 font-black leading-tight text-white"
          style={{ fontSize: isTablet ? 34 : 28 }}
        >
          Welcome to{"\n"}
          <Text style={{ color: "rgba(255,255,255,0.5)" }}>Maslog </Text>
          Care App
        </Text>

        <Text
          className="mb-7 leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: isTablet ? 14 : 13,
            maxWidth: isTablet ? 480 : undefined,
          }}
        >
          Your all-in-one healthcare assistant for the residents of Barangay
          Maslog — accessible, secure, and community-centered.
        </Text>

        <View className="flex-row gap-3">
          {STATS.map((stat) => (
            <View
              key={stat.label}
              className="flex-1 min-w-0 items-center rounded-2xl border border-white/15 bg-white/10 px-3 py-3.5"
            >
              <View className="mb-2 h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                <Feather
                  name={stat.icon}
                  size={15}
                  color="rgba(255,255,255,0.85)"
                />
              </View>
              <Text
                className="font-black leading-none text-white"
                style={{ fontSize: isTablet ? 22 : 18 }}
                numberOfLines={1}
              >
                {stat.value}
              </Text>
              <Text
                className="mt-1 text-center font-medium leading-tight text-white/55"
                style={{ fontSize: isTablet ? 11 : 9 }}
                numberOfLines={2}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
