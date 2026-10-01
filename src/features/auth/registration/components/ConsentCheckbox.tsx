import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import LegalDocumentDialog from "@/features/legal/components/LegalDocumentDialog";
import LegalLinks from "@/features/legal/components/LegalLinks";
import type { LegalDocumentKind } from "@/features/legal/types/legalDocument.types";

import { REG_COLORS } from "../registrationTheme";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ConsentCheckbox = ({ checked, onChange }: ConsentCheckboxProps) => {
  // The documents open over the form so nothing typed so far is lost.
  const [reading, setReading] = useState<LegalDocumentKind | null>(null);

  return (
    <View style={{ gap: 6 }}>
      <Pressable
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel="I agree to the terms and conditions and the privacy policy"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          minHeight: 44,
          paddingVertical: 4,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: checked ? 0 : 1.5,
            borderColor: REG_COLORS.borderStrong,
            backgroundColor: checked ? REG_COLORS.primary : REG_COLORS.surface,
          }}
        >
          {checked ? (
            <Feather name="check" size={14} color={REG_COLORS.surface} />
          ) : null}
        </View>

        <Text
          style={{
            flex: 1,
            fontSize: 13.5,
            lineHeight: 20,
            color: REG_COLORS.text,
          }}
        >
          I agree to the terms and conditions and the privacy policy.
        </Text>
      </Pressable>

      <View style={{ paddingLeft: 34 }}>
        <LegalLinks
          align="left"
          color={REG_COLORS.primary}
          onOpen={setReading}
        />
      </View>

      <LegalDocumentDialog kind={reading} onClose={() => setReading(null)} onOpenRelated={setReading} />
    </View>
  );
};

export default ConsentCheckbox;
