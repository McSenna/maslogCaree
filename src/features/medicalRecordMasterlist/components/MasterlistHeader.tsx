import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import { selectedCard } from "../masterlistLabels";
import HistoryBanner from "./HistoryBanner";
import MasterlistCards from "./MasterlistCards";
import { MASTERLIST_SUBTITLE, MASTERLIST_TITLE } from "./masterlistCopy";
import MasterlistToolbar from "./MasterlistToolbar";

type Props = { screen: MasterlistScreenState; phone: boolean; width: number };

/** Title, summary cards, filters and (when narrowed to one person) the history banner. */
const MasterlistHeader = ({ screen, phone, width }: Props) => {
  const palette = useAdminSurfacePalette();
  const { list, serviceForms, historyOf } = screen;
  const labelOf = (key: string) => serviceForms.forms.find((form) => form.categoryKey === key)?.label ?? key;

  return (
    <View className={phone ? "gap-3" : "gap-4"}>
      <DashboardHeader
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
        selected={historyOf ? null : selectedCard(list.criteria)}
        onSelect={screen.selectCard}
        columns={phone || width < 900 ? 2 : 4}
        compact={phone}
        dense={width < 360}
      />
      <MasterlistToolbar list={list} forms={serviceForms.forms} phone={phone} />
      {historyOf ? (
        <HistoryBanner
          resident={historyOf}
          total={list.total}
          serviceCounts={list.serviceCounts}
          serviceLabel={labelOf}
          onClear={screen.clearFilters}
        />
      ) : null}
    </View>
  );
};

export default MasterlistHeader;
