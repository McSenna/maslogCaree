import type { ReactElement } from "react";
import { View } from "react-native";
import GridCell from "@/features/adminDashboard/components/GridCell";

/**
 * Lower dashboard panels on wide screens. With one upcoming list (doctor, BHW) the queue, upcoming and
 * activity panels share one row; with two (midwife) they form a 2×2 grid with the queue first, so the
 * queue never stretches across the whole page with its name and status 1,400px apart.
 */
const WidePanels = ({
  queue,
  upcoming,
  activity,
  gap,
}: {
  queue: ReactElement;
  upcoming: ReactElement[];
  activity: ReactElement;
  gap: number;
}) => {
  if (upcoming.length <= 1) {
    return (
      <View style={{ flexDirection: "row", gap }}>
        <GridCell flex={1.15}>{queue}</GridCell>
        {upcoming.map((panel) => (
          <GridCell key={panel.key}>{panel}</GridCell>
        ))}
        <GridCell>{activity}</GridCell>
      </View>
    );
  }

  return (
    <View style={{ gap }}>
      <View style={{ flexDirection: "row", gap }}>
        <GridCell>{queue}</GridCell>
        <GridCell>{activity}</GridCell>
      </View>
      <View style={{ flexDirection: "row", gap }}>
        {upcoming.map((panel) => (
          <GridCell key={panel.key}>{panel}</GridCell>
        ))}
      </View>
    </View>
  );
};

export default WidePanels;
