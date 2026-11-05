import { ActivityIndicator, Text, View } from "react-native";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { TYPE } from "@/theme/typography";
const AccessLoadState = ({
  error,
  onRetry,
}: {
  error: boolean;
  onRetry: () => void;
}) => {
  const palette = useAdminSurfacePalette();
  return (
    <View className="max-w-full shrink gap-3 py-3">
      {error ? (
        <>
          <Text
            accessibilityRole="alert"
            style={[TYPE.body, { color: palette.negative }]}
          >
            Access settings could not be loaded. Retry before making changes.
          </Text>
          <DashboardButton
            palette={palette}
            label="Retry access settings"
            onPress={onRetry}
          />
        </>
      ) : (
        <ActivityIndicator
          color={palette.primary}
          accessibilityLabel="Loading access settings"
        />
      )}
    </View>
  );
};
export default AccessLoadState;
