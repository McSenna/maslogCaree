import { View } from "react-native";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

function Block({ h, w, r = 7 }: { h: number; w: number | "100%"; r?: number }) {
  const palette = useUserDetailsPalette();
  return <View style={{ height: h, width: w, borderRadius: r, backgroundColor: palette.skeleton }} />;
}

function RowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <Block h={34} w={34} r={DETAIL_RADIUS.well} />
      <View className="flex-1 gap-2">
        <Block h={9} w={96} />
        <Block h={12} w="100%" />
      </View>
    </View>
  );
}

/**
 * The sheet's shape while the record loads.
 *
 * Mirrors the real running order — summary, then sections — so the content
 * lands in place instead of pushing the sections around under the admin's
 * thumb, and so the sheet reads as opening rather than as broken.
 */
export default function UserSheetSkeleton() {
  return (
    <View accessibilityLabel="Loading user details" className="w-full pb-4" style={{ opacity: 0.8 }}>
      <View className="items-center gap-2.5 px-4 pb-4 pt-2">
        <Block h={80} w={80} r={9999} />
        <Block h={17} w={180} />
        <Block h={12} w={210} />
        <View className="mt-1 flex-row gap-1.5">
          <Block h={22} w={78} r={9999} />
          <Block h={22} w={66} r={9999} />
          <Block h={22} w={92} r={9999} />
        </View>
      </View>

      {[0, 1].map((section) => (
        <View key={section} className="px-4 pt-4">
          <Block h={10} w={140} />
          <RowSkeleton />
          <RowSkeleton />
        </View>
      ))}
    </View>
  );
}
