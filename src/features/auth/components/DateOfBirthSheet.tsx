import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import {
  BIRTH_YEARS,
  DAYS_OF_MONTH,
  DEFAULT_BIRTH_YEAR,
  MONTHS,
} from "../constants/registrationFields";
import { daysInMonth, toIsoBirthDate } from "../utils/dateOfBirth";
import DateWheelColumn from "./DateWheelColumn";

type DateOfBirthSheetProps = {
  visible: boolean;
  value: string;
  onConfirm: (date: string) => void;
  onClose: () => void;
};

const initialSelection = (value: string) => {
  const parts = value ? value.split("-") : [];
  return {
    year: parts[0] ? parseInt(parts[0], 10) : DEFAULT_BIRTH_YEAR,
    monthIndex: parts[1] ? parseInt(parts[1], 10) - 1 : 0,
    day: parts[2] ? parseInt(parts[2], 10) : 1,
  };
};

const DateOfBirthSheet = ({
  visible,
  value,
  onConfirm,
  onClose,
}: DateOfBirthSheetProps) => {
  const initial = initialSelection(value);
  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [day, setDay] = useState(initial.day);

  const lastDay = daysInMonth(year, monthIndex);
  const clampedDay = Math.min(day, lastDay);

  const handleConfirm = () => {
    onConfirm(toIsoBirthDate(year, monthIndex, clampedDay));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,23,42,0.5)" }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View className="bg-white rounded-t-3xl overflow-hidden">
          <View className="items-center pt-3 pb-1">
            <View className="w-9 h-1 rounded-full bg-slate-200" />
          </View>

          <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100">
            <Pressable onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-[13px] font-semibold text-slate-400">Cancel</Text>
            </Pressable>
            <Text className="text-[13px] font-bold text-slate-800">Date of Birth</Text>
            <Pressable onPress={handleConfirm} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-[13px] font-bold text-mc-primary">Done</Text>
            </Pressable>
          </View>

          <View className="items-center py-3 bg-slate-50 border-b border-slate-100">
            <Text className="text-[15px] font-extrabold text-slate-800 tracking-tight">
              {MONTHS[monthIndex]} {String(clampedDay).padStart(2, "0")}, {year}
            </Text>
          </View>

          <View className="flex-row px-4 pt-2 pb-8 gap-2" style={{ height: 230 }}>
            <DateWheelColumn
              label="Month"
              options={MONTHS}
              selected={MONTHS[monthIndex]}
              onSelect={(_month, index) => setMonthIndex(index)}
              flex={3}
              itemClassName="py-2 px-1.5 rounded-lg mb-0.5"
            />

            <View className="w-px bg-slate-100 self-stretch my-1" />

            <DateWheelColumn
              label="Day"
              options={DAYS_OF_MONTH.slice(0, lastDay)}
              selected={day}
              onSelect={setDay}
              flex={1.4}
            />

            <View className="w-px bg-slate-100 self-stretch my-1" />

            <DateWheelColumn label="Year" options={BIRTH_YEARS} selected={year} onSelect={setYear} flex={1.8} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateOfBirthSheet;
