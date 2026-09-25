import { ActivityIndicator, Pressable, Text, View } from "react-native";

import DetailsModalShell from "@/components/ui/dialog/DetailsModalShell";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type AdminTicketModalFallbackProps = {
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

/** Loading / unavailable dialog shown on small screens before the review sheet can open. */
const AdminTicketModalFallback = ({ loading, error, onClose }: AdminTicketModalFallbackProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <DetailsModalShell onClose={onClose} closeLabel="Close support request" maxWidth={420}>
      <View className="items-center gap-3 p-6">
        {loading ? (
          <>
            <ActivityIndicator size="small" color={palette.primary} />
            <Text className="text-[13px]" style={{ color: palette.muted }}>
              Loading support request…
            </Text>
          </>
        ) : (
          <>
            <Text className="text-[16px] font-bold" style={{ color: palette.heading }}>
              Request unavailable
            </Text>
            <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
              {error ?? "This support request could not be loaded."}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              className="mt-1 rounded-xl px-5 py-2.5 active:opacity-85"
              style={{ backgroundColor: palette.primary }}
            >
              <Text className="text-[13px] font-semibold text-white">Close</Text>
            </Pressable>
          </>
        )}
      </View>
    </DetailsModalShell>
  );
};

export default AdminTicketModalFallback;
