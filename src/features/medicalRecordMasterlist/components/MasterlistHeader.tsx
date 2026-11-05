import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import { selectedCard } from "../masterlistLabels";
import MasterlistCards from "./MasterlistCards";
import { MASTERLIST_SUBTITLE, MASTERLIST_TITLE } from "./masterlistCopy";
import MasterlistToolbar from "./MasterlistToolbar";

type Props = { screen: MasterlistScreenState; phone: boolean; width: number };

/** Title, summary cards and filters for the medical records list. */
const MasterlistHeader = ({ screen, phone, width }: Props) => {
  const palette = useAdminSurfacePalette();
  const { list, serviceForms } = screen;

  return (
    <View className={phone ? "gap-3" : "gap-4"}>
      <DashboardHeader
        hideHeading
        palette={palette}
        compact={phone}
        title={MASTERLIST_TITLE}
        subtitle={MASTERLIST_SUBTITLE}
        primaryAction={
          screen.canEncode ? { key: "add", label: "Add medical record", icon: "plus", onPress: screen.openNew } : undefined
        }
      />
      <MasterlistCards
        summary={screen.summary}
        selected={selectedCard(list.criteria)}
        onSelect={screen.selectCard}
        columns={phone || width < 900 ? 2 : 4}
        compact={phone}
        dense={width < 360}
      />
      <MasterlistToolbar list={list} forms={serviceForms.forms} phone={phone} />
    </View>
  );
};

export default MasterlistHeader;
