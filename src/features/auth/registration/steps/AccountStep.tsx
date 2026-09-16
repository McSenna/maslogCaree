import { View } from "react-native";
import PasswordRequirements from "../../forgotPassword/components/PasswordRequirements";
import PasswordInput from "../components/PasswordInput";
import SecurityNotice from "../components/SecurityNotice";
import StepHeading from "../components/StepHeading";
import { STEP_SUBTITLES } from "../registrationOptions";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";
import type { StepProps } from "./stepLayout";

const AccountStep = ({ form, layout }: StepProps) => {
  const { values, errors, setField, blurField } = form;

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title="Account Information" subtitle={STEP_SUBTITLES.account} />

      <PasswordInput
        label="Password"
        required
        value={values.password}
        onChangeText={(text) => setField("password", text)}
        onBlur={() => blurField("password")}
        placeholder="Create your password"
        error={errors.password}
        height={layout.inputHeight}
      />

      <View
        style={{
          padding: 14,
          borderRadius: REG_RADIUS.card,
          borderWidth: 1,
          borderColor: REG_COLORS.border,
          backgroundColor: REG_COLORS.surfaceMuted,
        }}
      >
        <PasswordRequirements value={values.password} />
      </View>

      <PasswordInput
        label="Confirm Password"
        required
        value={values.confirmPassword}
        onChangeText={(text) => setField("confirmPassword", text)}
        onBlur={() => blurField("confirmPassword")}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
        height={layout.inputHeight}
        autoComplete="off"
      />

      <SecurityNotice />
    </View>
  );
};

export default AccountStep;
