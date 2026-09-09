import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { RADIUS, useUsersPalette } from "./usersTheme";

type UsersPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  isDesktop: boolean;
  onPageChange: (page: number) => void;
  /**
   * What the rows are, for the summary line — "users", "logs", …
   *
   * The only thing that differs between the admin tables that use this footer,
   * so they share the component rather than each owning a lookalike.
   */
  noun?: string;
};

/** 1 2 3 4 5 … N, keeping the window anchored around the current page. */
function buildPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  if (page - 1 > 1) pages.add(page - 1);
  if (page + 1 < totalPages) pages.add(page + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, idx) => {
    if (idx > 0 && p - sorted[idx - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

export default function UsersPagination({
  page,
  totalPages,
  total,
  pageSize,
  isDesktop,
  onPageChange,
  noun = "users",
}: UsersPaginationProps) {
  const palette = useUsersPalette();

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const summary = `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()} ${noun}`;

  // Phones keep a single touch-friendly Previous / Page N / Next row — numbered
  // pages would either overflow 360px or shrink below a 44px target.
  if (!isDesktop) {
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
  }

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
}
