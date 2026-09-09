import { View } from "react-native";
import { CARD_SHADOW } from "../usersTheme";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

function Block({
  height,
  width,
  radius = 8,
  className,
}: {
  height: number;
  width?: number | string;
  radius?: number;
  className?: string;
}) {
  const palette = useUserDetailsPalette();

  return (
    <View
      className={className}
      style={{
        height,
        width: (width as number) ?? undefined,
        borderRadius: radius,
        backgroundColor: palette.skeleton,
      }}
    />
  );
}

function CardShell({ rows, compact }: { rows: number; compact: boolean }) {
  const palette = useUserDetailsPalette();

  return (
    <View
      className="w-full flex-1 border"
      style={{
        borderRadius: DETAIL_RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        className="flex-row items-center gap-2.5 px-5 py-4"
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        <Block height={32} width={32} radius={DETAIL_RADIUS.well} />
        <Block height={13} width={compact ? 120 : 160} />
      </View>

      <View className="gap-4 px-5 py-4">
        {Array.from({ length: rows }).map((_, index) => (
          <View key={index} className="flex-row items-center gap-3">
            <Block height={36} width={36} radius={DETAIL_RADIUS.well} />
            <View className="flex-1 gap-2">
              <Block height={9} width={90} />
              <Block height={12} className="w-full" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * The dialog's shape while the record loads.
 *
 * Mirrors the real layout — hero, then the same two columns — so the content
 * lands in place instead of pushing the cards around, and so the admin can see
 * a user is opening rather than reading the word "Loading".
 */
export default function UserDetailsSkeleton({ compact }: { compact: boolean }) {
  const palette = useUserDetailsPalette();

  return (
    <View
      accessibilityLabel="Loading user details"
      className="w-full gap-5"
      style={{ opacity: 0.75 }}
    >
      <View
        className={`w-full border p-6 ${compact ? "items-center gap-4" : "flex-row items-center gap-5"}`}
        style={{
          borderRadius: DETAIL_RADIUS.hero,
          backgroundColor: palette.heroTop,
          borderColor: palette.heroBorder,
        }}
      >
        <Block height={compact ? 96 : 120} width={compact ? 96 : 120} radius={9999} />
        <View className={`flex-1 gap-3 ${compact ? "items-center" : ""}`}>
          <Block height={26} width={compact ? 200 : 280} />
          <View className="flex-row gap-2">
            <Block height={26} width={92} radius={9999} />
            <Block height={26} width={78} radius={9999} />
            <Block height={26} width={108} radius={9999} />
          </View>
          <Block height={12} width={compact ? 220 : 300} />
        </View>
      </View>

      <View className={`w-full gap-5 ${compact ? "flex-col" : "flex-row"}`}>
        <View className="flex-1">
          <CardShell rows={5} compact={compact} />
        </View>
        <View className="flex-1 gap-5">
          <CardShell rows={2} compact={compact} />
          <CardShell rows={2} compact={compact} />
        </View>
      </View>
    </View>
  );
}
