import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";

import { MODAL_BACKDROP_DARK, MODAL_BACKDROP_LIGHT, MODAL_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type AdminTicketModalFallbackProps = {
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

const AdminTicketModalFallback = ({
  loading,
  error,
  onClose,
}: AdminTicketModalFallbackProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-out"
      style={{
        position: "fixed" as never,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: palette.isDark ? MODAL_BACKDROP_DARK : MODAL_BACKDROP_LIGHT,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
        ...Platform.select({
          web: {
            backdropFilter: "blur(1px)",
            WebkitBackdropFilter: "blur(1px)",
          } as object,
        }),
      }}
    >
      <Pressable
        onPress={onClose}
        accessibilityLabel="Dismiss modal backdrop"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View
        role={"dialog" as never}
        aria-modal={true}
        className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-700/80 shadow-2xl overflow-hidden items-center p-6 gap-3"
        style={{
          padding: 24,
          borderRadius: RADIUS.card,
          backgroundColor: palette.isDark ? palette.cardBg : "#FFFFFF",
          borderWidth: 1,
          borderColor: palette.isDark ? palette.cardBorder : "rgba(226, 232, 240, 0.85)",
          maxWidth: 420,
          width: "100%",
          alignItems: "center",
          gap: 12,
          zIndex: 1,
          ...MODAL_SHADOW,
        }}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color={palette.primary} />
            <Text style={{ fontSize: 13, color: palette.muted }}>Loading support ticket...</Text>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 16, fontWeight: "700", color: palette.negative }}>
              Ticket Unavailable
            </Text>
            <Text style={{ fontSize: 13, color: palette.muted, textAlign: "center" }}>
              {error ?? "This support ticket could not be loaded."}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                marginTop: 6,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: RADIUS.control,
                backgroundColor: palette.primary,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFFFFF" }}>Close</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default AdminTicketModalFallback;
