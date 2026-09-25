import { Pressable, ScrollView, Text, View } from "react-native";
import IconButton from "@/components/buttons/IconButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { MissionScheduleRecord } from "@/services/appointments";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";
import { formatMissionHours } from "../utils/slotLabels";
import WorkspacePanel, { PanelEmpty } from "./WorkspacePanel";

type MissionSelectorPanelProps = {
  missions: MissionScheduleRecord[];
  selectedMissionId: string | null;
  onSelect: (missionId: string) => void;
  onEdit: (mission: MissionScheduleRecord) => void;
  onDelete: (missionId: string) => void;
};

const TILE_WEB = webStyle({ transition: webTransition("border-color", "background-color") });
const SELECT_WEB = webStyle({ cursor: "pointer" });

const MissionSelectorPanel = ({ missions, selectedMissionId, onSelect, onEdit, onDelete }: MissionSelectorPanelProps) => {
  const colors = useThemeColors();

  return (
    <WorkspacePanel title="Select mission">
      {!missions.length ? (
        <PanelEmpty>No missions yet. Create one with Add Mission.</PanelEmpty>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: SPACING.sm }}>
            {missions.map((mission) => {
              const selected = selectedMissionId === mission._id;
              const date = new Date(mission.date).toLocaleDateString();

              return (
                <View
                  key={mission._id}
                  style={[
                    {
                      width: 208,
                      padding: SPACING.md,
                      gap: SPACING.sm,
                      borderRadius: RADII.medium,
                      borderWidth: 1,
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primarySoft : colors.surfaceMuted,
                    },
                    TILE_WEB,
                  ]}
                >
                  <Pressable
                    onPress={() => onSelect(mission._id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Mission on ${date}, ${formatMissionHours(mission)}`}
                    style={SELECT_WEB}
                  >
                    <Text style={[TYPE.bodyStrong, { color: colors.heading }]}>{date}</Text>
                    <Text style={[TYPE.caption, { color: colors.muted }]}>{formatMissionHours(mission)}</Text>
                  </Pressable>

                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <IconButton icon="edit-3" label="Edit mission schedule" size={36} onPress={() => onEdit(mission)} />
                    <IconButton
                      icon="trash-2"
                      label="Delete mission schedule"
                      size={36}
                      tone="danger"
                      onPress={() => onDelete(mission._id)}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </WorkspacePanel>
  );
};

export default MissionSelectorPanel;
