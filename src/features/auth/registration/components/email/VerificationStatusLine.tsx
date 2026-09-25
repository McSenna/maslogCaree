import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { useEmailVerification } from "../../hooks/useEmailVerification";
import { REG_COLORS } from "../../registrationTheme";
import { STATUS_STYLE, webOnly } from "./verificationTheme";

type VerificationStatusLineProps = {
  statusId: string;
  feedback: ReturnType<typeof useEmailVerification>["feedback"];
  hint: string;
};

const VerificationStatusLine = ({ statusId, feedback, hint }: VerificationStatusLineProps) => {
  const status = feedback ? STATUS_STYLE[feedback.tone] : null;

  return (
    <View
      nativeID={statusId}
      {...webOnly({ role: "status", "aria-live": "polite" })}
      accessibilityLiveRegion="polite"
      style={{ minHeight: 20, flexDirection: "row", justifyContent: "center", gap: 6 }}
    >
      {status && feedback ? (
        <>
          <Feather name={status.icon} size={15} color={status.color} style={{ marginTop: 2 }} />
          <Text
            style={{
              flexShrink: 1,
              fontSize: 13,
              lineHeight: 19,
              fontWeight: feedback.tone === "info" ? "400" : "600",
              color: status.color,
              textAlign: "center",
            }}
          >
            {feedback.message}
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 12.5, lineHeight: 18, color: REG_COLORS.muted, textAlign: "center" }}>
          {hint}
        </Text>
      )}
    </View>
  );
};

export default VerificationStatusLine;
