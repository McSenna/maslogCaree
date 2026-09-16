import { Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { MissionScheduleRecord } from "@/services/appointments";
import { formatMissionHours } from "../utils/slotLabels";

type MissionSelectorPanelProps = {
  missions: MissionScheduleRecord[];
  selectedMissionId: string | null;
  onSelect: (missionId: string) => void;
  onEdit: (mission: MissionScheduleRecord) => void;
  onDelete: (missionId: string) => void;
};
const MissionSelectorPanel = ({
  missions,
  selectedMissionId,
  onSelect,
  onEdit,
  onDelete,
}: MissionSelectorPanelProps) => {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">Select mission</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
        <View className="flex-row gap-2">
          {missions.map((mission) => (
            <View
              key={mission._id}
              className={`w-52 rounded-xl border px-3 py-2 ${
                selectedMissionId === mission._id
                  ? "border-mc-primary bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <Pressable onPress={() => onSelect(mission._id)} className="flex-1">
                <Text className="text-sm font-medium text-slate-800">
                  {new Date(mission.date).toLocaleDateString()}
                </Text>
                <Text className="mt-1 text-xs text-slate-500">{formatMissionHours(mission)}</Text>
              </Pressable>

              <View className="mt-2 flex-row items-center justify-between">
                <Pressable
                  onPress={() => onEdit(mission)}
                  accessibilityRole="button"
                  accessibilityLabel="Edit mission schedule"
                  className="rounded-lg bg-white/70 p-2"
                  hitSlop={8}
                >
                  <Feather name="edit-3" size={16} color="#3B5BDB" />
                </Pressable>
                <Pressable
                  onPress={() => onDelete(mission._id)}
                  accessibilityRole="button"
                  accessibilityLabel="Delete mission schedule"
                  className="rounded-lg bg-white/70 p-2"
                  hitSlop={8}
                >
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {!missions.length ? (
        <Text className="mt-2 text-sm text-slate-500">No missions yet. Create one above.</Text>
      ) : null}
    </View>
  );
};

export default MissionSelectorPanel;
