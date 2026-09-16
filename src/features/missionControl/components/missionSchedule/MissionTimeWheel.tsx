import { View } from "react-native";
import WheelColumn from "./timeWheel/WheelColumn";
import { MINUTE_STEP, type TimeParts } from "./timeWheel/timeParts";

export { MINUTE_STEP, formatTimeParts, parseTimeParts, type TimeParts } from "./timeWheel/timeParts";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, index) => index * MINUTE_STEP);
const PERIODS = ["AM", "PM"] as const;

const MissionTimeWheel = ({
  parts,
  onChange,
}: {
  parts: TimeParts;
  onChange: (next: TimeParts) => void;
}) => {
  return (
    <View className="w-full flex-row gap-2.5">
      <WheelColumn
        label="Hour"
        options={HOURS}
        value={parts.hour12}
        onChange={(hour12) => onChange({ ...parts, hour12 })}
        render={(hour) => String(hour)}
      />
      <WheelColumn
        label="Minute"
        options={MINUTES}
        value={parts.minute}
        onChange={(minute) => onChange({ ...parts, minute })}
        render={(minute) => String(minute).padStart(2, "0")}
      />
      <WheelColumn
        label="AM / PM"
        options={PERIODS as unknown as string[]}
        value={parts.isPm ? "PM" : "AM"}
        onChange={(period) => onChange({ ...parts, isPm: period === "PM" })}
        render={(period) => period}
        flex={1.1}
      />
    </View>
  );
};

export default MissionTimeWheel;
