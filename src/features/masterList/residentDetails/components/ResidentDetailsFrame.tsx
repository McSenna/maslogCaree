import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import StatePressable from "@/components/ui/StatePressable";

import Button from "@/components/buttons/Button";
import { useInteractionState } from "@/hooks/useInteractionState";
import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

import type { MasterResidentRecord } from "../../masterList.types";
import { toResidentDetails } from "../residentDetailsModel";
import type { ResidentDetailsState } from "../residentDetails.types";
import ResidentDetailsBody from "./ResidentDetailsBody";
import { ResidentDetailsError, ResidentDetailsNotFound, ResidentDetailsSkeleton } from "./ResidentDetailsStates";

export type ResidentDetailsFrameProps = {
  state: ResidentDetailsState;
  colors: ThemeColors;
  titleId: string;
  columns: boolean;
  /** Phone widths: the tighter identity banner. */
  compact: boolean;
  canEdit: boolean;
  /** Bottom safe-area inset for the sheet's pinned footer; 0 in the modal. */
  bottomInset?: number;
  /** The full-screen sheet fills its parent; the modal sizes to its content up to its max height. */
  fill?: boolean;
  onRetry: () => void;
  onClose: () => void;
  onEdit: (record: MasterResidentRecord) => void;
};

const CloseButton = ({ colors, onClose }: { colors: ThemeColors; onClose: () => void }) => {
  const { hovered, focused, handlers } = useInteractionState({ pressScale: 1 });
  return (
    <StatePressable
      {...handlers}
      accessibilityRole="button"
      accessibilityLabel="Close resident details"
      onPress={onClose}
      className="h-11 w-11 items-center justify-center rounded-full"
      style={({ pressed }) => ({
        backgroundColor: pressed || hovered ? colors.surfaceHover : colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        outlineWidth: focused ? 2 : 0,
        outlineOffset: 2,
        outlineColor: colors.focusRing,
        outlineStyle: "solid",
      })}
    >
      <Feather name="x" size={20} color={colors.heading} />
    </StatePressable>
  );
};

/** Header, scrolling body and pinned footer, shared by the desktop modal and the phone sheet. */
const ResidentDetailsFrame = (props: ResidentDetailsFrameProps) => {
  const { state, colors, titleId, columns, compact, canEdit, bottomInset = 0, fill = false, onRetry, onClose, onEdit } = props;
  const record = state.status === "ready" ? state.record : null;

  return (
    // On web, flex: 1 inside a container without a set height collapses to nothing, so only the sheet fills.
    <View className={fill ? "flex-1" : undefined} style={{ flexShrink: 1, minHeight: 0 }}>
      <View
        className="flex-row items-center justify-between gap-4 px-6 py-4"
        style={{ backgroundColor: colors.surfaceMuted, borderBottomWidth: 1, borderBottomColor: colors.divider }}
      >
        <Text nativeID={titleId} accessibilityRole="header" style={[TYPE.headline, { color: colors.heading, flexShrink: 1 }]}>
          Resident details
        </Text>
        <CloseButton colors={colors} onClose={onClose} />
      </View>

      <ScrollView style={{ flexShrink: 1 }} contentContainerClassName="p-6" showsVerticalScrollIndicator={false}>
        {state.status === "loading" ? <ResidentDetailsSkeleton columns={columns} /> : null}
        {state.status === "error" ? <ResidentDetailsError colors={colors} message={state.message} onRetry={onRetry} /> : null}
        {state.status === "notFound" ? <ResidentDetailsNotFound colors={colors} /> : null}
        {record ? <ResidentDetailsBody details={toResidentDetails(record)} colors={colors} columns={columns} compact={compact} /> : null}
      </ScrollView>

      <View
        className="flex-row gap-3 px-6 pt-4"
        style={{
          paddingBottom: 16 + bottomInset,
          backgroundColor: colors.surfaceMuted,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
        }}
      >
        <View className="flex-1">
          <Button label="Close" variant="secondary" fullWidth testID="resident-details-close" onPress={onClose} />
        </View>
        {canEdit && record ? (
          <View className="flex-1">
            <Button label="Edit record" icon="edit-2" fullWidth onPress={() => onEdit(record)} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ResidentDetailsFrame;
