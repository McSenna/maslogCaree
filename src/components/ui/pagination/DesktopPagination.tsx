import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { buildPageList } from "./buildPageList";

const DesktopPagination = ({
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
  const pages = buildPageList(page, totalPages);

  const stepStyle = (disabled: boolean) => ({
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.cardBorder,
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <View className="w-full flex-row flex-wrap items-center justify-between gap-3">
      <Text className="text-[13px] font-medium" style={{ color: palette.muted }}>
        {summary}
      </Text>

      <View className="flex-row items-center gap-1.5">
        <Pressable
          onPress={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          className="h-8 w-8 items-center justify-center"
          style={stepStyle(page <= 1)}
        >
          <Feather name="chevron-left" size={15} color={palette.body} />
        </Pressable>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <Text key={`ellipsis-${idx}`} className="px-1 text-[13px]" style={{ color: palette.muted }}>
              …
            </Text>
          ) : (
            <Pressable
              key={p}
              onPress={() => onPageChange(p)}
              accessibilityRole="button"
              accessibilityLabel={`Page ${p}`}
              accessibilityState={{ selected: p === page }}
              className="h-8 min-w-[32px] items-center justify-center px-2"
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: p === page ? palette.primary : palette.cardBorder,
                backgroundColor: p === page ? palette.primary : "transparent",
              }}
            >
              <Text
                className="text-[13px] font-semibold"
                style={{ color: p === page ? "#FFFFFF" : palette.body }}
              >
                {p}
              </Text>
            </Pressable>
          )
        )}

        <Pressable
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          accessibilityRole="button"
          accessibilityLabel="Next page"
          className="h-8 w-8 items-center justify-center"
          style={stepStyle(page >= totalPages)}
        >
          <Feather name="chevron-right" size={15} color={palette.body} />
        </Pressable>
      </View>
    </View>
  );
};

export default DesktopPagination;
