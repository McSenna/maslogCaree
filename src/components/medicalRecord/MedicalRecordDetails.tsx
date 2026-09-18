import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import {
  ClinicalBlock,
  CompletedBadge,
  FollowUpBlock,
  ItemsGivenBlock,
  ServiceDetailsBlock,
  VisitBlock,
} from "./details/RecordDetailSections";
import { Block, Row } from "./details/RecordPrimitives";

const SHEET_WIDTH = 768;

const MedicalRecordDetails = ({
  visible,
  record,
  form,
  onClose,
  showProviderNotes = true,
}: {
  visible: boolean;
  record: MedicalRecord | null;
  form: CompletionForm | null;
  onClose: () => void;
  showProviderNotes?: boolean;
}) => {
  const palette = useQueuePalette();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSheet = width < SHEET_WIDTH;

  if (!record) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close medical record"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : 620,
            maxHeight: isSheet ? "92%" : "88%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            backgroundColor: palette.panelBg,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-2.5">
              <View
                style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
              />
            </View>
          ) : null}

          <View
            className="flex-row items-center justify-between gap-3 px-5 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <View className="min-w-0 flex-1">
              <Text
                accessibilityRole="header"
                className="text-[17px] font-bold"
                style={{ color: palette.heading }}
              >
                Medical Record
              </Text>
              <Text
                numberOfLines={1}
                className="mt-0.5 text-[12.5px]"
                style={{ color: palette.muted }}
              >
                {form?.label ?? record.serviceType}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close medical record"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.skeleton }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
            style={SHEET_SCROLL_STYLE}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              gap: 14,
              paddingBottom: 16 + (isSheet ? Math.max(insets.bottom, 0) : 0),
            }}
          >
            <CompletedBadge record={record} palette={palette} />
            <VisitBlock record={record} form={form} palette={palette} />
            <ClinicalBlock record={record} palette={palette} />
            <ServiceDetailsBlock record={record} form={form} palette={palette} />
            <ItemsGivenBlock record={record} palette={palette} />
            <FollowUpBlock record={record} palette={palette} />

            {showProviderNotes && record.notes ? (
              <Block title="Provider notes" palette={palette}>
                <Row label="Notes" value={record.notes} palette={palette} />
              </Block>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MedicalRecordDetails;
