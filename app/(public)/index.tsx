import { Feather } from "@expo/vector-icons";
import { Redirect, type Href } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";
import ScreenScroll from "@/components/layout/ScreenScroll";
import HeroCard from "@/components/home/HeroCard";
import ServiceCard, { type ServiceCardItem } from "@/components/home/ServiceCard";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";

const SERVICES: ServiceCardItem[] = [
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

const HOW_TO_STEPS = [
  {
    title: "Create or Login to Your Account",
    description:
      "Residents can register or log in to access all healthcare services.",
    icon: "user-check" as const,
    color: "#2D5BFF",
  },
  {
    title: "Book Healthcare Appointments",
    description:
      "Schedule appointments or view your appointment history easily.",
    icon: "calendar" as const,
    color: "#10B981",
  },
  {
    title: "View Health Announcements",
    description:
      "Stay informed with barangay health advisories and programs.",
    icon: "bell" as const,
    color: "#F59E0B",
  },
  {
    title: "Connect with Health Workers",
    description:
      "Communicate with barangay health workers for direct assistance.",
    icon: "users" as const,
    color: "#8B5CF6",
  },
];

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
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="flex-row gap-4">
      <View className="items-center" style={{ width: 44, flexShrink: 0 }}>
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
            className="mt-1 w-px flex-1"
            style={{ backgroundColor: `${color}20`, minHeight: 24 }}
          />
        )}
      </View>

      <View className="flex-1 min-w-0 pb-5">
        <View className="mb-1 flex-row items-center gap-2">
          <View
            className="rounded-lg p-1.5"
            style={{ backgroundColor: `${color}12` }}
          >
            <Feather name={icon as any} size={13} color={color} />
          </View>
          <Text
            className="font-bold text-slate-800"
            style={{ fontSize: isTablet ? 14 : 13 }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <Text
          className="ml-8 leading-relaxed text-slate-400"
          style={{ fontSize: isTablet ? 12 : 11 }}
        >
          {desc}
        </Text>
      </View>
    </View>
  );
}

export default function Index() {
  const { user, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  if (!isLoading && user) {
    return <Redirect href={getDashboardPath(user.role) as Href} />;
  }

  return (
    <ScreenScroll>
      <View
        className="gap-6"
        style={{
          paddingHorizontal: isDesktop ? 48 : 0,
          maxWidth: 640,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <HeroCard />

        {/* Healthcare Services */}
        <View className="gap-3">
          <View>
            <Text
              className="font-black text-slate-900"
              style={{ fontSize: isTablet ? 20 : 17 }}
            >
              Healthcare Services
            </Text>
            <Text
              className="mt-0.5 text-slate-400"
              style={{ fontSize: isTablet ? 13 : 11 }}
            >
              Everything you need, right here
            </Text>
          </View>

          <View
            className="flex-row flex-wrap gap-3"
            style={
              isDesktop
                ? { justifyContent: "space-between" }
                : { justifyContent: "flex-start" }
            }
          >
            {SERVICES.map((s, i) => (
              <ServiceCard key={i} {...s} />
            ))}
          </View>
        </View>

        {/* How to Use */}
        <View className="gap-3">
          <View>
            <Text
              className="font-black text-slate-900"
              style={{ fontSize: isTablet ? 20 : 17 }}
            >
              How to Use the System
            </Text>
            <Text
              className="mt-0.5 text-slate-400"
              style={{ fontSize: isTablet ? 13 : 11 }}
            >
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
            {HOW_TO_STEPS.map((step, index) => (
              <StepRow
                key={index}
                number={index + 1}
                title={step.title}
                desc={step.description}
                icon={step.icon}
                color={step.color}
                isLast={index === HOW_TO_STEPS.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-center gap-2 py-3">
          <View
            className="rounded-full p-1.5"
            style={{ backgroundColor: "#F1F5F9" }}
          >
            <Feather name="lock" size={11} color="#94A3B8" />
          </View>
          <Text
            className="text-slate-400"
            style={{ fontSize: isTablet ? 12 : 11 }}
          >
            Secure & exclusively for Barangay Maslog residents
          </Text>
        </View>
      </View>
    </ScreenScroll>
  );
}
