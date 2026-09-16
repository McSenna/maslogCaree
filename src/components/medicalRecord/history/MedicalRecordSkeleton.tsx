import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";

const MedicalRecordSkeleton = ({
  palette,
  count = 3,
}: {
  palette: QueuePalette;
  count?: number;
}) => {
  return (
    <View className="w-full gap-3" accessibilityLabel="Loading medical records" accessible>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="w-full gap-3 p-4"
          style={{
            borderRadius: QUEUE_RADIUS.card,
            borderWidth: 1,
            borderColor: palette.panelBorder,
            backgroundColor: palette.panelBg,
          }}
        >
          <View className="w-full flex-row items-start gap-3">
            <Skeleton style={{ width: 40, height: 40, borderRadius: 13 }} />
            <View className="min-w-0 flex-1 gap-2">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-2/5" />
            </View>
          </View>

          <View className="gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </View>

          <View
            className="w-full flex-row items-center justify-between pt-3"
            style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
          >
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </View>
        </View>
      ))}
    </View>
  );
};

export default MedicalRecordSkeleton;
