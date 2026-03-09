import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Paragraph } from "@/components/ui/Typography";

type OrgMember = {
  _id: { $oid: string };
  fullname: string;
  gender: string;
  address: string;
  role: string;
  organizationId: string;
  photo: string;
};

export default function About() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/organizations`);
        setOrgMembers(response.data);
      } catch (err) {
        setError("Failed to load organization data.");
        console.error("Error fetching organizations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, [API_URL]);

  const getByRole = (role: string) => orgMembers.find((m) => m.role === role);

  const bhwMembers = orgMembers.filter(
    (m) => m.role === "bhw" || m.role === "bhwn"
  );

  const captain = getByRole("barangay_captain");
  const admin = getByRole("barangay_admin");
  const doctor = getByRole("doctor");

  const BHW_COLS = 3;
  const bhwRows: OrgMember[][] = [];
  for (let i = 0; i < bhwMembers.length; i += BHW_COLS) {
    bhwRows.push(bhwMembers.slice(i, i + BHW_COLS));
  }

    
  const BHW_PALETTE = [
    { fg: "#1D4ED8", bg: "#DBEAFE", light: "#EFF6FF" },
    { fg: "#059669", bg: "#D1FAE5", light: "#ECFDF5" },
    { fg: "#7C3AED", bg: "#EDE9FE", light: "#F5F3FF" },
    { fg: "#BE123C", bg: "#FFE4E6", light: "#FFF1F2" },
    { fg: "#B45309", bg: "#FEF3C7", light: "#FFFBEB" },
    { fg: "#0E7490", bg: "#CFFAFE", light: "#ECFEFF" },
    { fg: "#4338CA", bg: "#E0E7FF", light: "#EEF2FF" },
    { fg: "#A21CAF", bg: "#FAE8FF", light: "#FDF4FF" },
    { fg: "#4D7C0F", bg: "#ECFCCB", light: "#F7FEE7" },
    { fg: "#0F766E", bg: "#CCFBF1", light: "#F0FDFA" },
  ];

  const FEATURES = [
    {
      title: "Community-Centered Care",
      description:
        "Designed specifically for Barangay Maslog residents with easy access to all healthcare services.",
      icon: "heart",
      color: "#EF4444",
      bg: "#FFF1F2",
    },
    {
      title: "Digital Health Records",
      description:
        "Securely store and manage your health records and medical history online.",
      icon: "file-text",
      color: "#2D5BFF",
      bg: "#EFF6FF",
    },
    {
      title: "Easy Appointment Booking",
      description:
        "Schedule appointments with healthcare providers in just a few taps.",
      icon: "calendar",
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      title: "Real-Time Announcements",
      description:
        "Stay updated with health announcements and community programs.",
      icon: "bell",
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
  ];

  function ConnectorLine({ height = 24 }: { height?: number }) {
    return (
      <View className="items-center my-1">
        <View style={{ width: 1.5, height, backgroundColor: "#CBD5E1" }} />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: "#94A3B8",
            marginTop: -1,
          }}
        />
      </View>
    );
  }

  function LeaderCard({
    title,
    subtitle,
    icon,
    name,
    tier,
    isTablet,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    name?: string;
    tier: "top" | "mid";
    isTablet: boolean;
  }) {
    const isTop = tier === "top";
    const avatarSize = isTop ? (isTablet ? 64 : 52) : isTablet ? 52 : 44;
    const outerSize = avatarSize + 10;
    const iconSize = Math.round(avatarSize * 0.38);

    if (isTop) {
      return (
        <View
          className="flex-1 items-center rounded-2xl overflow-hidden mx-2"
          style={{
            backgroundColor: "#0C1F6E",
            shadowColor: "#0C1F6E",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 6,
          }}
        >
          <View style={{ height: 4, width: "100%", backgroundColor: "#F59E0B" }} />
          <View className="items-center w-full px-3 pt-5 pb-5">
            <View
              style={{
                width: outerSize,
                height: outerSize,
                borderRadius: outerSize / 2,
                borderWidth: 2,
                borderColor: "rgba(245,158,11,0.6)",
                borderStyle: "dashed",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: "rgba(245,158,11,0.4)",
                }}
              >
                <Feather name={icon as any} size={iconSize} color="#F59E0B" />
              </View>
            </View>

            <View
              className="rounded-xl w-full items-center px-2 py-1.5 mb-1.5"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <Text
                className="font-black text-center leading-snug"
                style={{ color: "#F59E0B", fontSize: isTablet ? 12 : 10.5 }}
                numberOfLines={2}
              >
                {name ?? "— Unassigned —"}
              </Text>
            </View>
            <Text
              className="text-center font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: isTablet ? 9 : 7.5 }}
            >
              {title}
            </Text>
            <Text
              className="text-center mt-0.5"
              style={{ color: "rgba(255,255,255,0.3)", fontSize: isTablet ? 8 : 6.5 }}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        className="flex-1 items-center rounded-2xl overflow-hidden mx-1"
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E2E8F0",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ height: 3, width: "100%", backgroundColor: "#10B981" }} />
        <View className="items-center w-full px-3 pt-4 pb-4">
          <View
            style={{
              width: outerSize,
              height: outerSize,
              borderRadius: outerSize / 2,
              borderWidth: 1.5,
              borderColor: "rgba(16,185,129,0.4)",
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: "#ECFDF5",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#A7F3D0",
              }}
            >
              <Feather name={icon as any} size={iconSize} color="#059669" />
            </View>
          </View>

          <View
            className="rounded-xl w-full items-center px-2 py-1.5 mb-1"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <Text
              className="font-black text-center leading-snug"
              style={{ color: "#059669", fontSize: isTablet ? 11 : 9.5 }}
              numberOfLines={2}
            >
              {name ?? "— Unassigned —"}
            </Text>
          </View>
          <Text
            className="text-center font-semibold uppercase tracking-wider"
            style={{ color: "#94A3B8", fontSize: isTablet ? 8.5 : 7.5 }}
          >
            {title}
          </Text>
          <Text
            className="text-center mt-0.5"
            style={{ color: "#CBD5E1", fontSize: isTablet ? 7.5 : 6.5 }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    );
  }

  function BhwCard({
    member,
    index,
    isTablet,
  }: {
    member: OrgMember;
    index: number;
    isTablet: boolean;
  }) {
    const palette = BHW_PALETTE[index % BHW_PALETTE.length];
    const avatarSize = isTablet ? 46 : 38;
    const outerSize = avatarSize + 8;

    const initials = member.fullname
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <View
        className="rounded-xl overflow-hidden"
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#F1F5F9",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <View style={{ height: 3, backgroundColor: palette.fg }} />
        <View className="items-center w-full px-1.5 pt-3 pb-3">
          <View
            style={{
              width: outerSize,
              height: outerSize,
              borderRadius: outerSize / 2,
              borderWidth: 1.5,
              borderColor: `${palette.fg}50`,
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 7,
            }}
          >
            <View
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: palette.bg,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: `${palette.fg}30`,
              }}
            >
              <Text
                style={{
                  fontSize: isTablet ? 13 : 11,
                  fontWeight: "900",
                  color: palette.fg,
                  letterSpacing: 0.5,
                }}
              >
                {initials}
              </Text>
            </View>
          </View>

          <View
            className="rounded-lg w-full items-center px-1 py-1 mb-1"
            style={{ backgroundColor: palette.light }}
          >
            <Text
              className="font-black text-center leading-snug"
              style={{ color: palette.fg, fontSize: isTablet ? 10 : 8.5 }}
              numberOfLines={2}
            >
              {member.fullname}
            </Text>
          </View>

          <Text
            className="text-center font-semibold uppercase"
            style={{ color: "#9CA3AF", fontSize: isTablet ? 7.5 : 6.5, letterSpacing: 0.8 }}
          >
            {member.role}
          </Text>
        </View>
      </View>
    );
  }

  function FeatureCard({
    title,
    description,
    icon,
    color,
    bg,
    isTablet,
  }: {
    title: string;
    description: string;
    icon: string;
    color: string;
    bg: string;
    isTablet: boolean;
  }) {
    return (
      <View
        className="bg-white rounded-2xl p-4 flex-row gap-3"
        style={{
          borderWidth: 1,
          borderColor: "#F1F5F9",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 1,
        }}
      >
        <View className="rounded-xl p-2.5 self-start" style={{ backgroundColor: bg }}>
          <Feather name={icon as any} size={isTablet ? 20 : 18} color={color} />
        </View>
        <View className="flex-1">
          <Text
            className="font-bold text-slate-800 mb-0.5"
            style={{ fontSize: isTablet ? 14 : 13 }}
          >
            {title}
          </Text>
          <Text
            className="text-slate-400 leading-relaxed"
            style={{ fontSize: isTablet ? 12 : 11 }}
          >
            {description}
          </Text>
        </View>
      </View>
    );
  }

  function SectionHeader({
    eyebrow,
    title,
    isTablet,
  }: {
    eyebrow: string;
    title: string;
    isTablet: boolean;
  }) {
    return (
      <View className="mb-3">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-1 h-3.5 rounded-full bg-blue-500" />
          <Text
            className="font-black uppercase tracking-widest text-slate-400"
            style={{ fontSize: isTablet ? 10 : 9 }}
          >
            {eyebrow}
          </Text>
        </View>
        <Text
          className="font-black text-slate-900"
          style={{ fontSize: isTablet ? 22 : 18 }}
        >
          {title}
        </Text>
      </View>
    );
  }


  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: isDesktop ? 48 : isTablet ? 28 : 16,
        paddingTop: 16,
        paddingBottom: 48,
        gap: 28,
      }}
    >
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "#7988d2",
          shadowColor: "#2D5BFF",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.22,
          shadowRadius: 24,
          elevation: 10,
        }}
      >
        <View
          className="absolute rounded-full"
          style={{
            width: 220, height: 220,
            top: -70, right: -50,
            backgroundColor: "rgba(45,91,255,0.15)",
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 90, height: 90,
            bottom: -20, left: 24,
            backgroundColor: "rgba(16,185,129,0.1)",
          }}
        />

        <View
          className="p-6"
          style={{ padding: isTablet ? 32 : 24 }}
        >
          <View className="flex-row items-center gap-3 mb-4">
            <View
              className="rounded-2xl items-center justify-center"
              style={{
                width: isTablet ? 52 : 44,
                height: isTablet ? 52 : 44,
                backgroundColor: "rgba(245,158,11,0.15)",
                borderWidth: 1,
                borderColor: "rgba(245,158,11,0.3)",
              }}
            >
              <Feather name="activity" size={isTablet ? 26 : 22} color="#F59E0B" />
            </View>
            <View>
              <Text
                className="font-bold uppercase tracking-widest"
                style={{ color: "#F59E0B", fontSize: 9 }}
              >
                Digital Healthcare
              </Text>
              <Text
                className="font-black text-white"
                style={{ fontSize: isTablet ? 26 : 22 }}
              >
                MASLOG CARE
              </Text>
            </View>
          </View>

          <Text
            className="leading-relaxed mb-5"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: isTablet ? 14 : 13,
              maxWidth: isTablet ? 480 : undefined,
            }}
          >
            Your trusted digital healthcare partner for Barangay Maslog —
            bringing quality care closer to every resident.
          </Text>

          <View
            className="flex-row rounded-2xl"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            {[
              { value: "24/7", label: "Support" },
              { value: "100+", label: "Residents" },
              { value: "Free", label: "Services" },
            ].map((s, i) => (
              <View
                key={i}
                className="flex-1 items-center py-3.5"
                style={
                  i < 2
                    ? {
                        borderRightWidth: 1,
                        borderRightColor: "rgba(255,255,255,0.08)",
                      }
                    : {}
                }
              >
                <Text
                  className="font-black"
                  style={{ color: "#F59E0B", fontSize: isTablet ? 18 : 15 }}
                >
                  {s.value}
                </Text>
                <Text
                  className="font-medium mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: isTablet ? 10 : 8.5 }}
                >
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="Our Purpose" title="Mission & Vision" isTablet={isTablet} />
        <View
          className="bg-white rounded-2xl p-4 flex-row gap-3"
          style={{
            borderWidth: 1,
            borderColor: "#E2E8F0",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center shrink-0">
            <Feather name="target" size={18} color="#2D5BFF" />
          </View>
          <Text
            className="flex-1 text-slate-500 leading-relaxed"
            style={{ fontSize: isTablet ? 14 : 12 }}
          >
            To empower Barangay Maslog residents through accessible, digital
            health services — fostering a community where every individual
            receives timely and compassionate care.
          </Text>
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="What We Offer" title="Key Features" isTablet={isTablet} />
        <View className="gap-2.5">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={i}
              title={f.title}
              description={f.description}
              icon={f.icon}
              color={f.color}
              bg={f.bg}
              isTablet={isTablet}
            />
          ))}
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="Our Community" title="About Barangay Maslog" isTablet={isTablet} />
        <View
          className="bg-white rounded-2xl p-4"
          style={{
            borderWidth: 1,
            borderColor: "#E2E8F0",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Paragraph>
            Barangay Maslog is a vibrant community dedicated to the health and
            well-being of its residents. Our healthcare workers and medical
            professionals are committed to providing comprehensive healthcare
            services to ensure a healthier community for all.
          </Paragraph>
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="Our People" title="Healthcare Team" isTablet={isTablet} />
        <Text
          className="text-slate-400 -mt-2 mb-4"
          style={{ fontSize: isTablet ? 12 : 11 }}
        >
          Organizational structure of Barangay Maslog&apos;s health team
        </Text>

        <View
          className="bg-white rounded-2xl py-6"
          style={{
            paddingHorizontal: isTablet ? 20 : 10,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.07,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          {loading ? (
            <View className="items-center py-12 gap-3">
              <ActivityIndicator size="large" color="#2D5BFF" />
              <Text className="text-slate-400 text-sm">Loading team data...</Text>
            </View>
          ) : error ? (
            <View className="items-center py-12 gap-3">
              <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center">
                <Feather name="alert-circle" size={28} color="#EF4444" />
              </View>
              <Text className="text-red-400 text-sm text-center">{error}</Text>
            </View>
          ) : (
            <View className="items-center w-full">
              <View style={{ width: "100%", paddingHorizontal: isTablet ? 40 : 20 }}>
                <LeaderCard
                  title="Barangay Captain"
                  subtitle="Head of Barangay Governance"
                  icon="shield"
                  name={captain?.fullname}
                  tier="top"
                  isTablet={isTablet}
                />
              </View>

              <ConnectorLine height={28} />

              <View
                style={{
                  height: 1.5,
                  backgroundColor: "#E2E8F0",
                  width: isTablet ? "55%" : "60%",
                }}
              />

              <View className="flex-row w-full gap-2">
                <LeaderCard
                  title="Barangay Admin"
                  subtitle="Operations & Coordination"
                  icon="settings"
                  name={admin?.fullname}
                  tier="mid"
                  isTablet={isTablet}
                />
                <LeaderCard
                  title="Doctor"
                  subtitle="Primary Healthcare Provider"
                  icon="activity"
                  name={doctor?.fullname}
                  tier="mid"
                  isTablet={isTablet}
                />
              </View>

              <ConnectorLine height={24} />

              <View className="flex-row items-center gap-2 w-full mb-4">
                <View className="flex-1 h-px" style={{ backgroundColor: "#E2E8F0" }} />
                <View
                  className="flex-row items-center gap-1.5 rounded-full px-3.5 py-1.5"
                  style={{ backgroundColor: "#0C1F6E" }}
                >
                  <Feather name="users" size={10} color="#fff" />
                  <Text
                    className="text-white font-black uppercase"
                    style={{ fontSize: isTablet ? 9.5 : 8, letterSpacing: 0.8 }}
                  >
                    Barangay Health Workers ({bhwMembers.length})
                  </Text>
                </View>
                <View className="flex-1 h-px" style={{ backgroundColor: "#E2E8F0" }} />
              </View>

              {bhwMembers.length === 0 ? (
                <Text className="text-slate-400 text-sm text-center py-5">
                  No BHW members found.
                </Text>
              ) : (
                <View className="w-full gap-2">
                  {bhwRows.map((row, rowIdx) => (
                    <View key={rowIdx} className="flex-row gap-2">
                      {row.map((member, colIdx) => (
                        <BhwCard
                          key={member.organizationId}
                          member={member}
                          index={rowIdx * BHW_COLS + colIdx}
                          isTablet={isTablet}
                        />
                      ))}
                      {row.length < BHW_COLS &&
                        Array.from({ length: BHW_COLS - row.length }).map(
                          (_, k) => <View key={`pad-${k}`} style={{ flex: 1 }} />
                        )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-2 py-2">
        <View className="rounded-full p-1.5" style={{ backgroundColor: "#F1F5F9" }}>
          <Feather name="lock" size={11} color="#94A3B8" />
        </View>
        <Text className="text-slate-400" style={{ fontSize: isTablet ? 12 : 11 }}>
          Secure &amp; exclusively for Barangay Maslog residents
        </Text>
      </View>
    </ScrollView>
  );
}