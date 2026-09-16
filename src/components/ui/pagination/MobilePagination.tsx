import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { RADIUS } from "@/design/adminSurfaces";
import type { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

const MobilePagination = ({
  page,
  totalPages,
  summary,
  onPageChange,
  palette,
}: {
  page: number;
  totalPages: number;
  summary: string;
  onPageChange: (page: number) => void;
  palette: ReturnType<typeof useAdminSurfacePalette>;
}) => {
  const stepButton = (direction: "prev" | "next") => {
    const disabled = direction === "prev" ? page <= 1 : page >= totalPages;
    return (
      <Pressable
        onPress={() =>
          onPageChange(direction === "prev" ? Math.max(1, page - 1) : Math.min(totalPages, page + 1))
        }
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={direction === "prev" ? "Previous page" : "Next page"}
        className="h-11 flex-row items-center gap-1.5 border px-4"
        style={{
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {direction === "prev" ? <Feather name="chevron-left" size={15} color={palette.body} /> : null}
        <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
          {direction === "prev" ? "Previous" : "Next"}
        </Text>
        {direction === "next" ? <Feather name="chevron-right" size={15} color={palette.body} /> : null}
      </Pressable>
    );
  };

  return (
    <View className="w-full gap-2.5">
      <Text className="text-center text-[12px] font-medium" style={{ color: palette.muted }}>
        {summary}
      </Text>
      <View className="flex-row items-center justify-between gap-2">
        {stepButton("prev")}
        <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          Page {page} of {Math.max(1, totalPages)}
        </Text>
        {stepButton("next")}
      </View>
    </View>
  );
};

export default MobilePagination;
