import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type AdminSupportEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

const AdminSupportEmptyState = ({ hasFilters, onClearFilters }: AdminSupportEmptyStateProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 56,
        paddingHorizontal: 24,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: palette.isDark ? "rgba(99, 102, 241, 0.12)" : "#F1F5F9",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather
          name={hasFilters ? "filter" : "inbox"}
          size={24}
          color={palette.muted}
        />
      </View>

      <Text style={{ fontSize: 16, fontWeight: "700", color: palette.heading }}>
        {hasFilters ? "No matching support requests" : "No support requests"}
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: palette.muted,
          textAlign: "center",
          maxWidth: 400,
          lineHeight: 19,
        }}
      >
        {hasFilters
          ? "There are currently no support requests matching your search query or filters."
          : "All resident and user support concerns have been processed. Great job!"}
      </Text>

      {hasFilters && onClearFilters ? (
        <Pressable
          onPress={onClearFilters}
          accessibilityRole="button"
          accessibilityLabel="Reset all filters"
          style={({ hovered, pressed }) => ({
            marginTop: 4,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: RADIUS.control,
            backgroundColor: hovered ? palette.primary : palette.cardBg,
            borderWidth: 1,
            borderColor: hovered ? palette.primary : palette.cardBorder,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          {({ hovered }) => (
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: hovered ? "#FFFFFF" : palette.heading,
              }}
            >
              Reset Filters
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
};

export default AdminSupportEmptyState;
