import { View } from "react-native";
import type { SystemLog } from "@/features/systemLogs/services/systemLogService";
import MobileLogCard from "./MobileLogCard";

type MobileLogListProps = {
  logs: SystemLog[];
  selectedId: string | null;
  onSelect: (log: SystemLog) => void;
};

const MobileLogList = ({ logs, selectedId, onSelect }: MobileLogListProps) => {
  return (
    <View className="w-full gap-2.5">
      {logs.map((log) => (
        <MobileLogCard key={log._id} log={log} isSelected={selectedId === log._id} onPress={() => onSelect(log)} />
      ))}
    </View>
  );
};

export default MobileLogList;
