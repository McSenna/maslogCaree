import { Feather } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";
import ScreenScroll from "../../components/layout/ScreenScroll";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardPath } from "../../data/mockUsers";

export default function Index() {
  const { user, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  if (!isLoading && user) {
    return <Redirect href={getDashboardPath(user.role)} />;
  }

  function StatBadge({
    value,
    label,
    icon,
  }: {
    value: string;
    label: string;
    icon: string;
  }) {
    return (
      <View className="flex-1 items-center rounded-2xl bg-white/10 px-3 py-3.5 border border-white/15">
        <View className="w-8 h-8 rounded-xl bg-white/10 items-center justify-center mb-2">
          <Feather name={icon as any} size={15} color="rgba(255,255,255,0.85)" />
        </View>
        <Text
          className="font-black text-white leading-none"
          style={{ fontSize: isTablet ? 22 : 18 }}
        >
          {value}
        </Text>
        <Text className="mt-1 text-center font-medium text-white/55 leading-tight"
          style={{ fontSize: isTablet ? 11 : 9 }}>
          {label}
        </Text>
      </View>
    );
  }

    function ServiceCard({
    icon,
    label,
    desc,
    color,
    bg,
    iconBg,
    border,
    shadow,
  }: {
    icon: string;
    label: string;
    desc: string;
    color: string;
    bg: string;
    iconBg: string;
    border: string;
    shadow: string;
  }) {
    const cardWidth = isDesktop ? "23%" : isTablet ? "47%" : "47%";

    return (
      <View
        className="rounded-2xl p-4"
        style={{
          width: cardWidth as any,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          shadowColor: shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Icon container — one shade darker than card bg */}
        <View
          className="mb-3 self-start rounded-xl p-2.5"
          style={{ backgroundColor: iconBg }}
        >
          <Feather name={icon as any} size={isTablet ? 22 : 18} color={color} />
        </View>

        <Text
          className="font-bold text-slate-800 leading-tight mb-1"
          style={{ fontSize: isTablet ? 14 : 13 }}
        >
          {label}
        </Text>

        <Text
          className="leading-relaxed"
          style={{
            fontSize: isTablet ? 12 : 11,
            color: "#6B7280",
            lineHeight: isTablet ? 17 : 15,
          }}
        >
          {desc}
        </Text>
      </View>
    );
}

  function StepRow({
    number,
    title,
    desc,
    icon,
    color,
    isLast,
  }: {
    number: number;
    title: string;
    desc: string;
    icon: string;
    color: string;
    isLast?: boolean;
  }) {
    return (
      <View className="flex-row gap-4">
        <View className="items-center" style={{ width: 44 }}>
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              backgroundColor: `${color}12`,
              borderWidth: 1.5,
              borderColor: `${color}35`,
            }}
          >
            <Text
              className="font-black"
              style={{ color, fontSize: isTablet ? 15 : 13 }}
            >
              {number}
            </Text>
          </View>
          {!isLast && (
            <View
              className="w-px mt-1 flex-1"
              style={{ backgroundColor: `${color}20`, minHeight: 24 }}
            />
          )}
        </View>

        <View className="flex-1 pb-5">
          <View className="flex-row items-center gap-2 mb-1">
            <View
              className="rounded-lg p-1.5"
              style={{ backgroundColor: `${color}12` }}
            >
              <Feather name={icon as any} size={13} color={color} />
            </View>
            <Text
              className="font-bold text-slate-800"
              style={{ fontSize: isTablet ? 14 : 13 }}
            >
              {title}
            </Text>
          </View>
          <Text
            className="text-slate-400 leading-relaxed ml-8"
            style={{ fontSize: isTablet ? 12 : 11 }}
          >
            {desc}
          </Text>
        </View>
      </View>
    );
  }

  const howToSteps = [
    {
      title: "Create or Login to Your Account",
      description: "Residents can register or log in to access all healthcare services.",
      icon: "user-check" as const,
      color: "#2D5BFF",
    },
    {
      title: "Book Healthcare Appointments",
      description: "Schedule appointments or view your appointment history easily.",
      icon: "calendar" as const,
      color: "#10B981",
    },
    {
      title: "View Health Announcements",
      description: "Stay informed with barangay health advisories and programs.",
      icon: "bell" as const,
      color: "#F59E0B",
    },
    {
      title: "Connect with Health Workers",
      description: "Communicate with barangay health workers for direct assistance.",
      icon: "users" as const,
      color: "#8B5CF6",
    },
  ];

    const services = [
      {
        icon: "activity",
        label: "Appointments",
        desc: "Schedule and manage visits to the Health Center.",
        color: "#2D5BFF",
        bg: "#FFFFFF",
        iconBg: "#EEF2FF",
        border: "#F1F5F9",
        shadow: "#0F172A",
      },
      {
        icon: "bell",
        label: "Announcements",
        desc: "Medical missions, vaccinations & health programs.",
        color: "#D97706",
        bg: "#FFFFFF",
        iconBg: "#FFFBEB",
        border: "#F1F5F9",
        shadow: "#0F172A",
      },
      {
        icon: "heart",
        label: "Health Services",
        desc: "Checkups, vaccinations & consultations.",
        color: "#C00707",
        bg: "#FFFFFF",
        iconBg: "#FF00001A",
        border: "#F1F5F9",
        shadow: "#0F172A",
      },
      {
        icon: "shield",
        label: "Health Records",
        desc: "View and manage your digital health history.",
        color: "#EA580C",
        bg: "#FFFFFF",
        iconBg: "#FFF7ED",
        border: "#F1F5F9",
        shadow: "#0F172A",
      },
    ];


  return (
    <ScreenScroll>
      <View className="gap-6" style={{ paddingHorizontal: isDesktop ? 48 : 0 }}>

        <View
          className="overflow-hidden rounded-3xl"
          style={{
            backgroundColor: "#7988d2",
            shadowColor: "#2D5BFF",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          <View
            className="absolute rounded-full"
            style={{
              width: 280, height: 280,
              top: -80, right: -80,
              backgroundColor: "rgba(45,91,255,0.15)",
            }}
          />
          <View
            className="absolute rounded-full"
            style={{
              width: 160, height: 160,
              bottom: -40, left: -30,
              backgroundColor: "rgba(16,185,129,0.12)",
            }}
          />
          <View
            className="absolute rounded-full"
            style={{
              width: 60, height: 60,
              top: 20, left: "45%",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />

          <View
            className="px-6 pt-7 pb-7"
            style={{ paddingHorizontal: isTablet ? 32 : 24 }}
          >
            <View className="self-start flex-row items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 mb-5">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text
                className="font-bold uppercase tracking-widest text-white/75"
                style={{ fontSize: 9 }}
              >
                Digital Health Platform
              </Text>
            </View>

            <Text
              className="text-white font-black leading-tight mb-3"
              style={{ fontSize: isTablet ? 34 : 28 }}
            >
              Welcome to{"\n"}
              <Text style={{ color: "rgba(255,255,255,0.5)" }}>Maslog </Text>
              Care App
            </Text>

            <Text
              className="leading-relaxed mb-7"
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
              <StatBadge value="10+" label="Health Workers" icon="users" />
              <StatBadge value="24/7" label="Digital Access" icon="clock" />
              <StatBadge value="Free" label="For Residents" icon="shield" />
            </View>
          </View>
        </View>

        <View className="gap-3">
          <View>
            <Text
              className="font-black text-slate-900"
              style={{ fontSize: isTablet ? 20 : 17 }}
            >
              Healthcare Services
            </Text>
            <Text className="text-slate-400 mt-0.5" style={{ fontSize: isTablet ? 13 : 11 }}>
              Everything you need, right here
            </Text>
          </View>

          <View
            className="flex-row flex-wrap gap-3"
            style={isDesktop ? { justifyContent: "space-between" } : {}}
          >
            {services.map((s, i) => (
              <ServiceCard key={i} {...s} />
            ))}
          </View>
        </View>

        <View className="gap-3">
          <View>
            <Text
              className="font-black text-slate-900"
              style={{ fontSize: isTablet ? 20 : 17 }}
            >
              How to Use the System
            </Text>
            <Text className="text-slate-400 mt-0.5" style={{ fontSize: isTablet ? 13 : 11 }}>
              Four simple steps to get started
            </Text>
          </View>

          <View
            className="rounded-3xl bg-white px-5 pt-6 pb-2"
            style={{
              borderWidth: 1,
              borderColor: "#F1F5F9",
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            {howToSteps.map((step, index) => (
              <StepRow
                key={index}
                number={index + 1}
                title={step.title}
                desc={step.description}
                icon={step.icon}
                color={step.color}
                isLast={index === howToSteps.length - 1}
              />
            ))}
          </View>
        </View>

        {/* ── FOOTER NOTE ── */}
        <View className="flex-row items-center justify-center gap-2 py-3">
          <View
            className="rounded-full p-1.5"
            style={{ backgroundColor: "#F1F5F9" }}
          >
            <Feather name="lock" size={11} color="#94A3B8" />
          </View>
          <Text className="text-slate-400" style={{ fontSize: isTablet ? 12 : 11 }}>
            Secure &amp; exclusively for Barangay Maslog residents
          </Text>
        </View>

      </View>
    </ScreenScroll>
  );
}