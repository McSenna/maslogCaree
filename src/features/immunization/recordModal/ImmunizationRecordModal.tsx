import { useId, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import Modal from "@/components/ui/AppModal";
import { useResponsive } from "@/hooks/useResponsive";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { useReducedMotion } from "@/theme/motion";
import { SPACING } from "@/theme/spacing";

import PatientStrip from "./PatientStrip";
import useRecordModalStyles from "./recordModalStyles";
import RecordTabs, { panelIdOf, RECORD_TABS, tabIdOf } from "./RecordTabs";
import ScheduleCards from "./ScheduleCards";
import ScheduleTable from "./ScheduleTable";
import type { ImmunizationRecord, RecordTab } from "./types";
import VisitBar from "./VisitBar";

const TITLE = "Baby immunization record";
const MAX_WIDTH = 1228;
// Below this the six age columns are too narrow for their chips, and the app's
// tables fall back to cards rather than scrolling sideways.
const TABLE_MIN_WIDTH = 1000;
const SIDE_BY_SIDE_MIN_WIDTH = 1088;
const VISIT_INLINE_MIN_WIDTH = 1000;
const WINDOW_GUTTER = SPACING.xl;

export type ImmunizationRecordModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  record: ImmunizationRecord;
  initialTab?: RecordTab;
  onBabyDetails: () => void;
  onMotherDetails: () => void;
  onMotherRecords: () => void;
};

const RecordContent = ({
  onClose,
  onEdit,
  record,
  initialTab = "vaccinations",
  onBabyDetails,
  onMotherDetails,
  onMotherRecords,
}: Omit<ImmunizationRecordModalProps, "open">) => {
  const { styles } = useRecordModalStyles();
  const { width, height, isMobile } = useResponsive();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const baseId = useId();
  const [tab, setTab] = useState<RecordTab>(initialTab);
  useWebModalBehavior(true, onClose);
  const attachFocusTrap = useFocusTrap(true);

  const modalWidth = isMobile ? width : Math.min(MAX_WIDTH, width - WINDOW_GUTTER * 2);
  const bodyWidth = modalWidth - WINDOW_GUTTER * 2;
  const cardWidth = isMobile ? "100%" : (bodyWidth - SPACING.md) / 2;
  const animation = reducedMotion ? "none" : isMobile ? "slide" : "fade";
  // The web Modal already renders role="dialog" with aria-modal. A second dialog
  // inside it would be announced twice, so this surface only ties in the title.
  const dialogProps = Platform.select({
    web: { role: "group", "aria-labelledby": titleId } as object,
  });

  return (
    <Modal visible transparent accessibilityLabel={TITLE} animationType={animation} onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.backdrop, !isMobile && { paddingVertical: SPACING.xxl }]}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Close ${TITLE}`} onPress={onClose} style={StyleSheet.absoluteFill} />
        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          {...dialogProps}
          style={
            isMobile
              ? [styles.sheet, { paddingTop: insets.top, paddingBottom: insets.bottom }]
              : [styles.surface, { width: modalWidth, maxHeight: height - SPACING.xxl * 2 }]
          }
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>03 · FOCUSED TABS</Text>
              <Text nativeID={titleId} accessibilityRole="header" style={styles.title}>
                {TITLE}
              </Text>
              <Text style={styles.subtitle}>Medical record · {record.recordId}</Text>
            </View>
            <IconButton icon="x" size={44} label="Close" onPress={onClose} showTooltip={false} style={styles.closeButton} />
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={[styles.body, isMobile && styles.bodyPhone]}>
            <PatientStrip
              baby={record.baby}
              mother={record.mother}
              stacked={modalWidth < SIDE_BY_SIDE_MIN_WIDTH}
              onBabyDetails={onBabyDetails}
              onMotherDetails={onMotherDetails}
              onMotherRecords={onMotherRecords}
            />
            <RecordTabs baseId={baseId} active={tab} onChange={setTab} />
            {RECORD_TABS.filter((item) => item.key === tab).map((item) => (
              <View key={item.key} nativeID={panelIdOf(baseId, item.key)} role="tabpanel" aria-labelledby={tabIdOf(baseId, item.key)} style={styles.panel}>
                {item.key === "vaccinations" ? (
                  <>
                    <VisitBar record={record} stacked={modalWidth < VISIT_INLINE_MIN_WIDTH} />
                    {modalWidth >= TABLE_MIN_WIDTH ? (
                      <ScheduleTable vaccines={record.vaccines} />
                    ) : (
                      <ScheduleCards vaccines={record.vaccines} cardWidth={cardWidth} />
                    )}
                    <Text style={styles.footnote}>Schedule shown from saved record · Review pending doses with the provider.</Text>
                  </>
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>[CONTENT TBD]</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, isMobile && styles.footerPhone]}>
            <View style={[styles.footerButton, isMobile && styles.footerButtonPhone]}>
              <Button fullWidth variant="secondary" label="Close" onPress={onClose} />
            </View>
            <View style={[styles.footerButton, isMobile && styles.footerButtonPhone]}>
              <Button fullWidth label="Edit record" onPress={onEdit} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/** Mounted only while open, so the chosen tab and focus never carry over between records. */
const ImmunizationRecordModal = ({ open, ...props }: ImmunizationRecordModalProps) =>
  open ? <RecordContent {...props} /> : null;

export default ImmunizationRecordModal;
