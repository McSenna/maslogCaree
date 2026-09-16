import { Feather } from "@expo/vector-icons";
import type { MutableRefObject } from "react";
import { Text, TextInput, View } from "react-native";

const MC_PRIMARY = "#2A7DE1";

type Props = {
  otpDigits: string[];
  inputRefs: MutableRefObject<(TextInput | null)[]>;
  verificationError: string;
  isVerifying: boolean;
  onDigitChange: (text: string, index: number) => void;
  onKeyPress: (e: { nativeEvent: { key: string } }, index: number) => void;
};

const OtpDigitRow = ({
  otpDigits,
  inputRefs,
  verificationError,
  isVerifying,
  onDigitChange,
  onKeyPress,
}: Props) => {
  return (
    <View>
      <Text className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
        6-Digit Code
      </Text>
      <View className="flex-row gap-2">
        {otpDigits.map((digit, i) => (
          <View
            key={i}
            className="flex-1 items-center justify-center rounded-xl border-2"
            style={{
              height: 52,
              borderColor: verificationError ? "#EF4444" : digit ? MC_PRIMARY : "#E2E8F0",
              backgroundColor: digit ? "#EEF2FF" : "#F8FAFC",
            }}
          >
            <TextInput
              ref={(r) => {
                inputRefs.current[i] = r;
              }}
              value={digit}
              onChangeText={(t) => onDigitChange(t, i)}
              onKeyPress={(e) => onKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              className="w-full h-full text-slate-800"
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: digit ? MC_PRIMARY : "#94A3B8",
              }}
              selectTextOnFocus
              editable={!isVerifying}
            />
          </View>
        ))}
      </View>
      {verificationError ? (
        <View className="flex-row mt-2 items-center gap-2">
          <Feather name="alert-circle" size={12} color="#DC2626" />
          <Text className="text-red-600 text-[11px]">{verificationError}</Text>
        </View>
      ) : (
        <Text className="mt-1.5 text-[9.5px] text-slate-400">
          This code will expire in 5 minutes.
        </Text>
      )}
    </View>
  );
};

export default OtpDigitRow;
