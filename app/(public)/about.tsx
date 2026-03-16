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

const HC = {
  teal:        "#0B7A75",
  tealLight:   "#14A89F",
  tealPale:    "#E6F7F6",
  tealMid:     "#B2E5E3",
  emerald:     "#059669",
  emeraldPale: "#ECFDF5",
  navy:        "#0F2D3D",
  navyMid:     "#1A4259",
  sky:         "#0EA5E9",
  skyPale:     "#E0F2FE",
  gold:        "#D4A017",
  goldPale:    "#FEF9EC",
  white:       "#FFFFFF",
  offWhite:    "#F4F9F9",
  slate:       "#64748B",
  slateLight:  "#94A3B8",
  border:      "#D1EAE9",
  shadow:      "#0B7A75",
};

type OrgMember = {
  _id: { $oid: string };
  fullname: string;
  gender: string;
  address: string;
  role: string;
  organizationId: string;
  photo: string;
};

const BHW_PALETTE = [
  { fg: "#0B7A75", bg: "#B2E5E3", light: "#E6F7F6" },
  { fg: "#059669", bg: "#A7F3D0", light: "#ECFDF5" },
  { fg: "#0369A1", bg: "#BAE6FD", light: "#E0F2FE" },
  { fg: "#7C3AED", bg: "#DDD6FE", light: "#F5F3FF" },
  { fg: "#B45309", bg: "#FDE68A", light: "#FFFBEB" },
  { fg: "#0E7490", bg: "#A5F3FC", light: "#ECFEFF" },
  { fg: "#4338CA", bg: "#C7D2FE", light: "#EEF2FF" },
  { fg: "#BE123C", bg: "#FECDD3", light: "#FFF1F2" },
  { fg: "#4D7C0F", bg: "#D9F99D", light: "#F7FEE7" },
  { fg: "#0F766E", bg: "#99F6E4", light: "#F0FDFA" },
];

const MedicalCross = ({ size = 16, color = HC.teal, opacity = 1 }: { size?: number; color?: string; opacity?: number }) => {
  const arm = size * 0.28;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center", opacity }}>
      <View style={{ position: "absolute", width: arm, height: size, backgroundColor: color, borderRadius: arm / 2 }} />
      <View style={{ position: "absolute", width: size, height: arm, backgroundColor: color, borderRadius: arm / 2 }} />
    </View>
  );
};

const ConnectorLine = ({ height = 24 }: { height?: number }) => (
  <View style={{ alignItems: "center", marginVertical: 2 }}>
    <View style={{ width: 2, height, backgroundColor: HC.tealMid }} />
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: HC.teal, marginTop: -1 }} />
  </View>
);

const SectionHeader = ({ eyebrow, title, isTablet }: { eyebrow: string; title: string; isTablet: boolean }) => (
  <View style={{ marginBottom: 12 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <MedicalCross size={14} color={HC.teal} />
      <Text style={{ fontSize: isTablet ? 10 : 9, fontWeight: "800", color: HC.teal, letterSpacing: 2, textTransform: "uppercase" }}>
        {eyebrow}
      </Text>
    </View>
    <Text style={{ fontSize: isTablet ? 22 : 18, fontWeight: "900", color: HC.navy }}>
      {title}
    </Text>
  </View>
);

const LeaderCard = ({
  title, subtitle, icon, name, tier, isTablet,
}: {
  title: string; subtitle: string; icon: string;
  name?: string; tier: "top" | "mid"; isTablet: boolean;
}) => {
  const isTop = tier === "top";
  const avatarSize = isTop ? (isTablet ? 64 : 54) : isTablet ? 52 : 44;
  const outerSize = avatarSize + 12;
  const iconSize = Math.round(avatarSize * 0.38);

  if (isTop) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          borderRadius: 20,
          marginHorizontal: 8,
          backgroundColor: HC.navy,
          borderTopWidth: 5, borderTopColor: HC.tealLight,
          shadowColor: "#90CAF9",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <View style={{ position: "absolute", width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(11,122,117,0.12)", top: -20, right: -20 }} />
        <View style={{ position: "absolute", width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(20,168,159,0.08)", bottom: 10, left: -15 }} />

        <View style={{ alignItems: "center", width: "100%", paddingHorizontal: 12, paddingTop: 20, paddingBottom: 18 }}>
          <View
            style={{
              width: outerSize, height: outerSize, borderRadius: outerSize / 2,
              borderWidth: 2, borderColor: HC.tealLight, borderStyle: "dashed",
              alignItems: "center", justifyContent: "center", marginBottom: 12,
            }}
          >
            <View
              style={{
                width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
                backgroundColor: "rgba(11,122,117,0.25)",
                alignItems: "center", justifyContent: "center",
                borderWidth: 1.5, borderColor: "rgba(20,168,159,0.5)",
              }}
            >
              <Feather name={icon as any} size={iconSize} color={HC.tealLight} />
            </View>
          </View>

          <View style={{ borderRadius: 10, width: "100%", alignItems: "center", paddingHorizontal: 8, paddingVertical: 6, marginBottom: 6, backgroundColor: "rgba(11,122,117,0.2)", borderWidth: 1, borderColor: "rgba(20,168,159,0.2)" }}>
            <Text style={{ color: HC.tealLight, fontSize: isTablet ? 12 : 10.5, fontWeight: "900", textAlign: "center" }} numberOfLines={2}>
              {name ?? "— Unassigned —"}
            </Text>
          </View>

          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: isTablet ? 9 : 7.5, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.2, textAlign: "center" }}>
            {title}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: isTablet ? 8 : 6.5, textAlign: "center", marginTop: 2 }}>
            {subtitle}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1, alignItems: "center", borderRadius: 16, marginHorizontal: 4,
        backgroundColor: HC.white,
        borderWidth: 1, borderColor: HC.border,
        borderTopWidth: 4, borderTopColor: HC.teal,
        shadowColor: "#90CAF9",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View style={{ alignItems: "center", width: "100%", paddingHorizontal: 12, paddingTop: 14, paddingBottom: 14 }}>
        <View
          style={{
            width: outerSize, height: outerSize, borderRadius: outerSize / 2,
            borderWidth: 1.5, borderColor: `${HC.teal}50`, borderStyle: "dashed",
            alignItems: "center", justifyContent: "center", marginBottom: 10,
          }}
        >
          <View
            style={{
              width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
              backgroundColor: HC.tealPale,
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: HC.tealMid,
            }}
          >
            <Feather name={icon as any} size={iconSize} color={HC.teal} />
          </View>
        </View>

        <View style={{ borderRadius: 8, width: "100%", alignItems: "center", paddingHorizontal: 6, paddingVertical: 5, marginBottom: 4, backgroundColor: HC.tealPale }}>
          <Text style={{ color: HC.teal, fontSize: isTablet ? 11 : 9.5, fontWeight: "900", textAlign: "center" }} numberOfLines={2}>
            {name ?? "— Unassigned —"}
          </Text>
        </View>

        <Text style={{ color: HC.slateLight, fontSize: isTablet ? 8.5 : 7.5, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, textAlign: "center" }}>
          {title}
        </Text>
        <Text style={{ color: "#CBD5E1", fontSize: isTablet ? 7.5 : 6.5, textAlign: "center", marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

const BhwCard = ({ member, index, isTablet }: { member: OrgMember; index: number; isTablet: boolean }) => {
  const palette = BHW_PALETTE[index % BHW_PALETTE.length];
  const avatarSize = isTablet ? 46 : 38;
  const outerSize = avatarSize + 8;
  const initials = member.fullname
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <View
      style={{
        flex: 1, borderRadius: 14,
        backgroundColor: HC.white,
        borderWidth: 1, borderColor: "#EEF2F1",
        borderTopWidth: 3, borderTopColor: palette.fg,
        shadowColor: "#90CAF9",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View style={{ alignItems: "center", width: "100%", paddingHorizontal: 6, paddingTop: 10, paddingBottom: 10 }}>
        <View
          style={{
            width: outerSize, height: outerSize, borderRadius: outerSize / 2,
            borderWidth: 1.5, borderColor: `${palette.fg}40`, borderStyle: "dashed",
            alignItems: "center", justifyContent: "center", marginBottom: 7,
          }}
        >
          <View
            style={{
              width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
              backgroundColor: palette.bg,
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: `${palette.fg}30`,
            }}
          >
            <Text style={{ fontSize: isTablet ? 13 : 11, fontWeight: "900", color: palette.fg, letterSpacing: 0.5 }}>
              {initials}
            </Text>
          </View>
        </View>

        <View style={{ borderRadius: 6, width: "100%", alignItems: "center", paddingHorizontal: 4, paddingVertical: 4, marginBottom: 3, backgroundColor: palette.light }}>
          <Text style={{ color: palette.fg, fontSize: isTablet ? 10 : 8.5, fontWeight: "900", textAlign: "center" }} numberOfLines={2}>
            {member.fullname}
          </Text>
        </View>

        <Text style={{ color: "#9CA3AF", fontSize: isTablet ? 7.5 : 6.5, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, textAlign: "center" }}>
          {member.role === "bhw" ? "BHW" : "BHWN"}
        </Text>
      </View>
    </View>
  );
};

export default function About() {
  const { width } = useWindowDimensions();
  const isTablet  = width >= 768;
  const isDesktop = width >= 1024;

  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

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

  const getByRole  = (role: string) => orgMembers.find((m) => m.role === role);
  const bhwMembers = orgMembers.filter((m) => m.role === "bhw" || m.role === "bhwn");
  const captain    = getByRole("barangay_captain");
  const admin      = getByRole("barangay_admin");
  const doctor     = getByRole("doctor");

  const BHW_COLS = 3;
  const bhwRows: OrgMember[][] = [];
  for (let i = 0; i < bhwMembers.length; i += BHW_COLS) {
    bhwRows.push(bhwMembers.slice(i, i + BHW_COLS));
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: HC.offWhite }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: isDesktop ? 16 : isTablet ? 12 : 0,
        paddingTop: 20,
        paddingBottom: 52,
        gap: 28,
      }}
    >
      {/* Hero Card */}
      <View
        style={{
          borderRadius: 24,
          backgroundColor: "#7988d2",
          marginHorizontal: 4,
          padding: 24,
        }}
      >
        {/* Decorative blobs — moved inside flow, no absolute positioning conflict */}
        <View
          style={{
            position: "absolute", width: 160, height: 160, borderRadius: 80,
            backgroundColor: "rgba(255,255,255,0.09)", top: -30, right: -30,
          }}
          pointerEvents="none"
        />
        <View
          style={{
            position: "absolute", width: 90, height: 90, borderRadius: 45,
            backgroundColor: "rgba(255,255,255,0.07)", bottom: 10, left: -10,
          }}
          pointerEvents="none"
        />

        {/* Icon badge + title row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <View
            style={{
              width: 46, height: 46, borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Feather name="heart" size={22} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.65)", letterSpacing: 2, textTransform: "uppercase" }}>
              Barangay Maslog
            </Text>
            <Text style={{ fontSize: isTablet ? 22 : 20, fontWeight: "800", color: "#fff" }}>
              Maslog Care
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={{ fontSize: isTablet ? 14 : 13, color: "rgba(255,255,255,0.78)", lineHeight: 21, marginBottom: 20 }}>
          Stay updated with the latest health services, programs, and care reminders from your community.
        </Text>

        {/* Pill badge */}
        <View
          style={{
            flexDirection: "row", alignItems: "center", gap: 8,
            alignSelf: "flex-start",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 50,
            paddingHorizontal: 16, paddingVertical: 9,
          }}
        >
          <Feather name="users" size={14} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
            Free Community Health Services
          </Text>
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="Our Purpose" title="Mission & Vision" isTablet={isTablet} />
        <View
          style={{
            backgroundColor: HC.white, borderRadius: 18, padding: 16,
            flexDirection: "row", gap: 14,
            borderWidth: 1, borderColor: HC.border,
              
          }}
        >
          <View
            style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: HC.tealPale, borderWidth: 1, borderColor: HC.tealMid,
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Feather name="target" size={20} color={HC.teal} />
          </View>
          <Text style={{ flex: 1, color: HC.slate, lineHeight: isTablet ? 22 : 20, fontSize: isTablet ? 14 : 12.5 }}>
            To empower Barangay Maslog residents through accessible, digital health services — fostering a community where every individual receives timely and compassionate care.
          </Text>
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="Our Community" title="About Barangay Maslog" isTablet={isTablet} />
        <View
          style={{
            backgroundColor: HC.white, borderRadius: 18, padding: 16,
            borderWidth: 1, borderColor: HC.border,
              
          }}
        >
          <View style={{ flexDirection: "row", gap: 14 }}>
            <View style={{ width: 4, borderRadius: 2, backgroundColor: HC.teal }} />
            <Text style={{ flex: 1, color: HC.slate, lineHeight: isTablet ? 22 : 20, fontSize: isTablet ? 14 : 12.5 }}>
              Barangay Maslog is a vibrant community dedicated to the health and well-being of its residents. Our healthcare workers and medical professionals are committed to providing comprehensive healthcare services to ensure a healthier community for all.
            </Text>
          </View>
        </View>
      </View>

      <View>
        <SectionHeader eyebrow="Our People" title="Healthcare Team" isTablet={isTablet} />
        <Text style={{ color: HC.slateLight, fontSize: isTablet ? 12 : 11, marginTop: -8, marginBottom: 16 }}>
          Organizational structure of Barangay Maslog's health team
        </Text>

        <View
          style={{
            borderRadius: 20,
            paddingVertical: 8, paddingHorizontal: isTablet ? 8 : 4,
          }}
        >
          {loading ? (
            <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
              <ActivityIndicator size="large" color={HC.teal} />
              <Text style={{ color: HC.slateLight, fontSize: 14 }}>Loading team data...</Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" }}>
                <Feather name="alert-circle" size={28} color="#EF4444" />
              </View>
              <Text style={{ color: "#EF4444", fontSize: 14, textAlign: "center" }}>{error}</Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", width: "100%" }}>
              <View style={{ width: "100%", paddingHorizontal: isTablet ? 16 : 8 }}>
                <LeaderCard title="Barangay Captain" subtitle="Head of Barangay Governance" icon="shield" name={captain?.fullname} tier="top" isTablet={isTablet} />
              </View>

              <ConnectorLine height={28} />

              <View style={{ height: 1.5, backgroundColor: HC.tealMid, width: isTablet ? "55%" : "60%" }} />

              <View style={{ flexDirection: "row", width: "100%", gap: 8 }}>
                <LeaderCard title="Barangay Admin" subtitle="Operations & Coordination" icon="settings" name={admin?.fullname} tier="mid" isTablet={isTablet} />
                <LeaderCard title="Doctor" subtitle="Primary Healthcare Provider" icon="activity" name={doctor?.fullname} tier="mid" isTablet={isTablet} />
              </View>

              <ConnectorLine height={24} />

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, width: "100%", marginBottom: 14 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: HC.border }} />
                <View
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 6,
                    borderRadius: 50, paddingHorizontal: 14, paddingVertical: 6,
                    backgroundColor: HC.teal,
                  }}
                >
                  <MedicalCross size={10} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: isTablet ? 9.5 : 8, letterSpacing: 0.8, textTransform: "uppercase" }}>
                    Health Workers ({bhwMembers.length})
                  </Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: HC.border }} />
              </View>

              {bhwMembers.length === 0 ? (
                <Text style={{ color: HC.slateLight, fontSize: 14, textAlign: "center", paddingVertical: 20 }}>
                  No BHW members found.
                </Text>
              ) : (
                <View style={{ width: "100%", gap: 8 }}>
                  {bhwRows.map((row, rowIdx) => (
                    <View key={rowIdx} style={{ flexDirection: "row", gap: 8 }}>
                      {row.map((member, colIdx) => (
                        <BhwCard key={member.organizationId} member={member} index={rowIdx * BHW_COLS + colIdx} isTablet={isTablet} />
                      ))}
                      {row.length < BHW_COLS &&
                        Array.from({ length: BHW_COLS - row.length }).map((_, k) => (
                          <View key={`pad-${k}`} style={{ flex: 1 }} />
                        ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 8 }}>
        <View style={{ borderRadius: 50, padding: 6, backgroundColor: HC.tealPale }}>
          <Feather name="lock" size={11} color={HC.teal} />
        </View>
        <Text style={{ color: HC.slateLight, fontSize: isTablet ? 12 : 11 }}>
          Secure &amp; exclusively for Barangay Maslog residents
        </Text>
      </View>
    </ScrollView>
  );
}