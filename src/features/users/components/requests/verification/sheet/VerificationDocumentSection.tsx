import { Text, View } from "react-native";

import { useUserDetailsPalette } from "../../../details/detailsTheme";
import IdDocumentViewer, { formatFileSize } from "../../IdDocumentViewer";
import type { UserRequestDetail } from "../../../../services/userRequestsService";

type Props = {
  verificationId: string | null;
  verification?: UserRequestDetail["verification"];
};

const VerificationDocumentSection = ({ verificationId, verification }: Props) => {
  const palette = useUserDetailsPalette();
  const sizeLabel = formatFileSize(verification?.idFileSize);

  return (
    <View className="gap-2 pt-1">
      <IdDocumentViewer
        verificationId={verificationId}
        mimeType={verification?.idMimeType}
        fileName={verification?.idFileName}
        fileSize={verification?.idFileSize}
        height={220}
      />
      <Text className="text-[11.5px]" style={{ color: palette.subtle }}>
        {verification?.idFileName || "Government ID"}
        {sizeLabel ? ` • ${sizeLabel}` : ""}
      </Text>
      <Text className="text-[11.5px] leading-[17px]" style={{ color: palette.subtle }}>
        Check that the name, birthdate and photo on the ID match the registration details above.
      </Text>
    </View>
  );
};

export default VerificationDocumentSection;
