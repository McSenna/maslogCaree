import { View } from "react-native";

import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export const QueueLoadingState = () => (
  <View accessibilityLabel="Loading the queue" className="gap-3 px-4 py-4">
    {[0, 1, 2].map((i) => (
      <View key={i} className="flex-row items-center gap-3">
        <Skeleton style={{ height: 44, width: 44, borderRadius: 12 }} />
        <View className="flex-1 gap-1.5">
          <Skeleton style={{ height: 13, width: "55%", borderRadius: 6 }} />
          <Skeleton style={{ height: 11, width: "35%", borderRadius: 6 }} />
        </View>
      </View>
    ))}
  </View>
);

export const QueueErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <ErrorState compact title="Unable to load the queue" message={error} onRetry={onRetry} />
);

export const QueueEmptyState = ({ title, message }: { title: string; message: string }) => (
  <EmptyState compact icon="check-circle" title={title} description={message} />
);
