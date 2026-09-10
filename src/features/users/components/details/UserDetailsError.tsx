import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

/**
 * The record could not be read.
 *
 * Shared by the desktop dialog and the phone sheet: the surface stays open and
 * explains itself rather than closing, so the admin does not lose their place
 * in the list and can retry from where they are.
 */
export default function UserDetailsError({
  onRetry,
  message,
}: {
  onRetry?: () => void;
  message?: string;
}) {
  const palette = useUserDetailsPalette();

  return (
    <View className="w-full items-center gap-3 px-6 py-16">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.dangerBg }}
      >
        <Feather name="alert-circle" size={20} color={palette.dangerText} />
      </View>
      <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
        Unable to load user details.
      </Text>
      <Text className="max-w-[420px] text-center text-[13px]" style={{ color: palette.muted }}>
        {message ?? "This account could not be read. It may have been removed since the list loaded."}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again"
          className="mt-1 h-11 justify-center px-5"
          style={{ borderRadius: DETAIL_RADIUS.control, backgroundColor: palette.primary }}
        >
          <Text className="text-[14px] font-semibold text-white">Try Again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
