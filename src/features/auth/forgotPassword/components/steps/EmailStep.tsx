import { Image, View } from "react-native";

import { landingAssets } from "@/config/landingAssets";

import type { ForgotPasswordController } from "../../useForgotPassword";
import {
  PrimaryButton,
  RecoveryField,
  RecoveryMessage,
  TextButton,
} from "../RecoveryControls";
import { StepHeading } from "./StepChrome";

export const EmailStep = ({ flow }: { flow: ForgotPasswordController }) => (
  <View className="w-full items-center gap-5">
    <Image source={landingAssets.brandMark} style={{ width: 52, height: 52 }} resizeMode="contain" />
    <StepHeading
      title="Forgot Password?"
      subtitle="Enter your Gmail address and we'll send you a verification code."
    />

    <RecoveryField
      label="Email address"
      icon="mail"
      value={flow.email}
      onChangeText={(text) => {
        flow.setEmail(text);
        if (flow.error) flow.setError(null);
      }}
      placeholder="yourname@gmail.com"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      editable={!flow.isLoading}
      error={Boolean(flow.error)}
      onSubmitEditing={() => void flow.sendCode()}
      returnKeyType="send"
    />

    {flow.error ? <RecoveryMessage tone="error" text={flow.error} /> : null}

    <View className="w-full gap-1">
      <PrimaryButton
        label="Send Verification Code"
        loadingLabel="Sending Code..."
        loading={flow.isLoading}
        onPress={() => void flow.sendCode()}
      />
      <TextButton label="Back to Login" icon="arrow-left" onPress={flow.close} />
    </View>
  </View>
);
