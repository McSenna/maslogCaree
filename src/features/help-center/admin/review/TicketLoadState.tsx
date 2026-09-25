import { ActivityIndicator, Text, View } from "react-native";
import FeedbackState from "@/components/feedback/FeedbackState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { friendlyErrorMessage } from "@/utils/friendlyError";

type TicketLoadStateProps = {
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

const TicketLoadState = ({ loading, error, onClose }: TicketLoadStateProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingBottom: 40 }}>
      {loading ? (
        <View accessibilityLiveRegion="polite" style={{ alignItems: "center", gap: 12 }}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={{ fontSize: 13, color: colors.muted }}>Loading support request…</Text>
        </View>
      ) : (
        <FeedbackState
          icon="alert-circle"
          tone="error"
          title="Request unavailable"
          description={friendlyErrorMessage(error, "This support request could not be loaded.")}
          action={{ label: "Close", onPress: onClose }}
        />
      )}
    </View>
  );
};

export default TicketLoadState;
