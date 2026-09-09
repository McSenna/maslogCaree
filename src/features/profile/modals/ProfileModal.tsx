import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import { LANDING_COLORS } from "@/config/landingAssets";
import {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
  PROFILE_TYPE,
} from "../config/profileTheme";
import { useProfile } from "../hooks/useProfile";
import AccountSettingsCard from "../components/AccountSettingsCard";
import HealthNoteStrip from "../components/HealthNoteStrip";
import HelpSupportCard from "../components/HelpSupportCard";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import PersonalInformationCard from "../components/PersonalInformationCard";
import ProfileErrorState from "../components/ProfileErrorState";
import ProfileHero from "../components/ProfileHero";
import ProfileNoticeModal from "../components/ProfileNoticeModal";
import ProfileOverlay from "../components/ProfileOverlay";
import ProfileSkeleton from "../components/ProfileSkeleton";

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

/** Below this the two content columns stack rather than squeeze (§33). */
const TWO_COLUMN_MIN_WIDTH = 1024;

/** Target width on a 1920×1080 desktop, capped by the viewport (§4). */
const MODAL_MAX_WIDTH = 1180;
const VIEWPORT_MARGIN = 40;

function FooterBrand() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
      <MaslogCareLogo size={32} color={LANDING_COLORS.primaryBlue} />
      <View>
        <Text style={{ fontSize: 16.5, fontWeight: "800", letterSpacing: -0.3 }}>
          <Text style={{ color: LANDING_COLORS.navy }}>Maslog</Text>
          <Text style={{ color: LANDING_COLORS.primaryBlue }}>Care</Text>
        </Text>
        <Text
          style={{
            fontSize: 9.5,
            lineHeight: 12,
            fontWeight: "600",
            color: PROFILE_COLORS.subtle,
          }}
        >
          Healthy Residents, Stronger Community
        </Text>
      </View>
    </View>
  );
}

function FooterButton({
  label,
  onPress,
  tone,
  icon,
}: {
  label: string;
  onPress: () => void;
  tone: "neutral" | "danger";
  icon?: keyof typeof Feather.glyphMap;
}) {
  const danger = tone === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      // Press feedback rides on the class, not on a style callback: a
      // function-form `style` on Pressable is dropped, taking the fill with it.
      className="flex-row items-center justify-center active:opacity-85"
      style={{
        gap: 8,
        minHeight: 44,
        paddingHorizontal: 22,
        borderRadius: PROFILE_RADIUS.control,
        borderWidth: danger ? 0 : 1,
        borderColor: PROFILE_COLORS.border,
        backgroundColor: danger ? PROFILE_COLORS.danger : PROFILE_COLORS.surface,
      }}
    >
      {icon ? (
        <Feather
          name={icon}
          size={16}
          color={danger ? "#FFFFFF" : PROFILE_COLORS.body}
        />
      ) : null}
      <Text
        style={{
          fontSize: 14.5,
          fontWeight: danger ? "700" : "600",
          color: danger ? "#FFFFFF" : PROFILE_COLORS.body,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * The web profile, presented as a large centred modal over the dashboard (§2).
 *
 * Content scrolls inside the modal so the page behind never moves, and the
 * header and footer stay put while it does (§53).
 */
export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const state = useProfile({ onAfterLogout: onClose });
  const { width, height } = useWindowDimensions();

  const twoColumn = width >= TWO_COLUMN_MIN_WIDTH;
  const modalWidth = Math.min(MODAL_MAX_WIDTH, width - VIEWPORT_MARGIN);
  const modalMaxHeight = Math.round(height * 0.88);

  const title = state.profile?.role.title ?? "Profile";

  return (
    <>
      <ProfileOverlay
        visible={visible}
        onClose={onClose}
        accessibilityLabel={title}
      >
        <View
          style={{
            width: modalWidth,
            maxHeight: modalMaxHeight,
            borderRadius: PROFILE_RADIUS.modal,
            backgroundColor: PROFILE_COLORS.surface,
            overflow: "hidden",
            ...PROFILE_SHADOW.modal,
          }}
        >
          {/* ── Header ───────────────────────────────────────────── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 16,
              paddingHorizontal: 28,
              paddingTop: 24,
              paddingBottom: 18,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                style={{
                  fontSize: PROFILE_TYPE.modalTitle,
                  fontWeight: "800",
                  letterSpacing: -0.6,
                  color: PROFILE_COLORS.navy,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14.5,
                  color: PROFILE_COLORS.muted,
                }}
              >
                View and manage your personal information.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close profile"
              onPress={onClose}
              hitSlop={10}
              className="items-center justify-center active:opacity-70"
              style={{ width: 38, height: 38, borderRadius: 19 }}
            >
              <Feather name="x" size={21} color={PROFILE_COLORS.muted} />
            </Pressable>
          </View>

          {/* ── Body (the only scrolling region) ─────────────────── */}
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 28,
              paddingBottom: 24,
              gap: 18,
            }}
            showsVerticalScrollIndicator={false}
          >
            {state.loading ? (
              <ProfileSkeleton twoColumn={twoColumn} />
            ) : !state.profile ? (
              <ProfileErrorState onRetry={state.retry} />
            ) : (
              <>
                <ProfileHero
                  profile={state.profile}
                  variant="wide"
                  onEditProfile={state.onEditProfile}
                  onChangePhoto={state.onChangePhoto}
                />

                <View
                  style={{
                    flexDirection: twoColumn ? "row" : "column",
                    alignItems: "flex-start",
                    gap: 18,
                  }}
                >
                  <View
                    style={{
                      flex: twoColumn ? 1.15 : undefined,
                      width: twoColumn ? undefined : "100%",
                      gap: 14,
                    }}
                  >
                    <PersonalInformationCard
                      fields={state.profile.fields}
                      onEdit={state.onEditProfile}
                    />
                    <HealthNoteStrip />
                  </View>

                  <View
                    style={{
                      flex: twoColumn ? 1 : undefined,
                      width: twoColumn ? undefined : "100%",
                      gap: 14,
                    }}
                  >
                    <AccountSettingsCard
                      onChangePassword={state.onChangePassword}
                      onNotificationSettings={state.onNotificationSettings}
                      onPrivacySecurity={state.onPrivacySecurity}
                    />
                    <HelpSupportCard
                      onHelpCenter={state.onHelpCenter}
                      onContactSupport={state.onContactSupport}
                      onAbout={state.onAbout}
                      appVersion={state.appVersion}
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          {/* ── Footer ───────────────────────────────────────────── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 28,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: PROFILE_COLORS.border,
              backgroundColor: PROFILE_COLORS.surface,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <FooterBrand />
            </View>

            <FooterButton label="Close" onPress={onClose} tone="neutral" />
            <FooterButton
              label="Log Out"
              onPress={state.requestLogout}
              tone="danger"
              icon="log-out"
            />
          </View>
        </View>
      </ProfileOverlay>

      <LogoutConfirmModal
        visible={state.logoutVisible}
        busy={state.loggingOut}
        onCancel={state.cancelLogout}
        onConfirm={state.confirmLogout}
      />

      <ProfileNoticeModal notice={state.notice} onClose={state.dismissNotice} />
    </>
  );
}
