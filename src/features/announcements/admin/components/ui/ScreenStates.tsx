import { Plus, RotateCw } from "lucide-react-native";
import { Text, View } from "react-native";

import { PrimaryButton, SecondaryButton, TextButton } from "./Buttons";

const SkeletonRow = ({ first = false }: { first?: boolean }) => (
  <View className={`gap-2.5 px-4 py-4 ${first ? "" : "border-t border-divider"}`}>
    <View className="h-4 w-[60%] rounded-badge bg-neutral" />
    <View className="h-3.5 w-[90%] rounded-badge bg-neutral" />
    <View className="h-3 w-[40%] rounded-badge bg-neutral" />
  </View>
);

/** First load only: four still blocks shaped like rows. No shimmer. */
export const LoadingRows = () => (
  <View accessible accessibilityLabel="Loading announcements" accessibilityState={{ busy: true }}>
    <SkeletonRow first />
    <SkeletonRow />
    <SkeletonRow />
    <SkeletonRow />
  </View>
);

const StateFrame = ({ title, message, children }: { title: string; message: string; children: React.ReactNode }) => (
  <View className="items-center gap-2 px-4 py-12">
    <Text accessibilityRole="header" className="text-center font-ps-semibold text-15 text-ink">
      {title}
    </Text>
    <Text className="max-w-[360px] text-center font-ps text-14 leading-21 text-text2">{message}</Text>
    <View className="mt-3">{children}</View>
  </View>
);

export const LoadError = ({ onRetry }: { onRetry: () => void }) => (
  <StateFrame title="Could not load announcements." message="Check your connection and try again.">
    <SecondaryButton label="Retry" icon={RotateCw} onPress={onRetry} />
  </StateFrame>
);

export const NoAnnouncements = ({ onCreate }: { onCreate: () => void }) => (
  <StateFrame
    title="No announcements yet"
    message="Create an announcement to share it with patients and staff."
  >
    <PrimaryButton label="New announcement" icon={Plus} onPress={onCreate} />
  </StateFrame>
);

export const NoResults = ({ onClear }: { onClear: () => void }) => (
  <StateFrame title="No announcements found" message="Nothing matches the current search and filters.">
    <TextButton label="Clear filters" onPress={onClear} />
  </StateFrame>
);
