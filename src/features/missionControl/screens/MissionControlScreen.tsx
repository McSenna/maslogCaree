import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import QueueStatCards, { QUEUE_CARD_STATUS, type QueueCardKey } from "@/components/appointmentQueue/QueueStatCards";
import {
  FOUR_CARD_WIDTH,
  TABLE_WIDTH,
  TWO_COLUMN_WIDTH,
  useQueuePalette,
} from "@/components/appointmentQueue/queueTheme";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import AddMissionButton from "../components/AddMissionButton";
import MissionToolsButton from "../components/MissionToolsButton";
import QueueDashboardSections from "../components/QueueDashboardSections";
import { useMissionControl } from "../hooks/useMissionControl";
import MissionControlModals from "./MissionControlModals";

const QUEUE_SECTIONS = ["today", "list"] as const;

const MissionControlScreen = () => {
  const palette = useQueuePalette();
  const insets = useRoleScreenInsets();
  const { user } = useAuth();
  const control = useMissionControl();
  const [missionToolsOpen, setMissionToolsOpen] = useState(false);
  const [newMissionOpen, setNewMissionOpen] = useState(false);

  const { actions, picker } = control;
  const { scrollRef, topRef, anchors, scrollTo } = useScrollToSection(QUEUE_SECTIONS, insets.paddingTop);
  const { today: todayAnchor, list: listAnchor } = anchors;

  // A summary card opens its list below: today's schedule, or an appointments tab.
  const selectCard = (key: QueueCardKey) => {
    const status = QUEUE_CARD_STATUS[key];
    if (!status) {
      scrollTo("today");
      return;
    }
    control.dashboard.setActiveStatus(status);
    scrollTo("list");
  };

  const twoColumn = insets.width >= TWO_COLUMN_WIDTH;
  const asTable = insets.width >= TABLE_WIDTH;
  const fourCards = insets.width >= FOUR_CARD_WIDTH;

  const { openAssign } = control;

  const closeEdit = useCallback(() => {
    actions.closeEdit();
    picker.close();
  }, [actions, picker]);

  const closeNewMission = useCallback(() => {
    setNewMissionOpen(false);
    picker.close();
  }, [picker]);

  const submitNewMission = useCallback(async () => {
    const created = await actions.createMission();
    if (created) closeNewMission();
  }, [actions, closeNewMission]);

  return (
    <View className="flex-1">
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom,
          gap: 16,
        }}
      >
        <View ref={topRef}>
          <Text className="text-[22px] font-bold" style={{ color: palette.heading }}>
            Appointments &amp; Queue
          </Text>
          <Text className="mt-1 text-[13px]" style={{ color: palette.muted }}>
            {control.scopeDescription}
          </Text>
        </View>

        <QueueStatCards
          overview={control.dashboard.overview}
          loading={control.dashboard.overviewLoading}
          wide={fourCards}
          activeStatus={control.dashboard.activeStatus}
          onSelectCard={selectCard}
        />

        <QueueDashboardSections
          control={control}
          twoColumn={twoColumn}
          asTable={asTable}
          onAssign={openAssign}
          todayRef={todayAnchor}
          listRef={listAnchor}
          headerAction={
            control.canManageMissions ? (
              <View className="flex-row items-center gap-2">
                <MissionToolsButton palette={palette} onPress={() => setMissionToolsOpen(true)} />
                <AddMissionButton palette={palette} onPress={() => setNewMissionOpen(true)} />
              </View>
            ) : null
          }
        />
      </ScrollView>

      <MissionControlModals
        control={control}
        palette={palette}
        insets={insets}
        userName={user?.name ?? null}
        missionToolsOpen={missionToolsOpen}
        onCloseMissionTools={() => setMissionToolsOpen(false)}
        newMissionOpen={newMissionOpen}
        openAssign={openAssign}
        closeEdit={closeEdit}
        closeNewMission={closeNewMission}
        submitNewMission={() => void submitNewMission()}
      />
    </View>
  );
};

export default MissionControlScreen;
