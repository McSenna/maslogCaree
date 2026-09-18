import { ScrollView, View } from "react-native";

import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";

import SheetSection from "../../../details/SheetSection";
import UserDetailsError from "../../../details/UserDetailsError";
import UserSheetSkeleton from "../../../details/UserSheetSkeleton";
import { InfoRows } from "../../../details/userDetailRows";
import type { UserRequestDetail } from "../../../../services/userRequestsService";
import type { VerificationDecision } from "../useVerificationDecision";
import { buildResidentRows } from "../verificationRows";
import VerificationDocumentSection from "./VerificationDocumentSection";
import VerificationIdentityCard from "./VerificationIdentityCard";
import VerificationResidentHeader from "./VerificationResidentHeader";

type Props = {
  request: UserRequestDetail | null;
  loading: boolean;
  error: string | null;
  registeredLabel: string;
  decision: VerificationDecision;
  onRetry?: () => void;
};

const VerificationSheetBody = ({
  request,
  loading,
  error,
  registeredLabel,
  decision,
  onRetry,
}: Props) => {
  return (
    <ScrollView
      style={SHEET_SCROLL_STYLE}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 12 }}
    >
      {error && !request ? (
        <UserDetailsError onRetry={onRetry} message={error} />
      ) : !request || loading ? (
        <UserSheetSkeleton />
      ) : (
        <View className="w-full gap-5 pb-1 pt-4">
          <VerificationResidentHeader
            resident={request.resident}
            verification={request.verification}
            registeredLabel={registeredLabel}
          />

          <SheetSection title="Resident Information">
            <InfoRows rows={buildResidentRows(request)} compact />
          </SheetSection>

          <SheetSection title="Identity Information">
            <VerificationIdentityCard
              verification={request.verification}
              showFullIdNumber={decision.showFullIdNumber}
              onToggleIdNumber={decision.toggleIdNumber}
            />
          </SheetSection>

          <SheetSection title="Submitted ID Document">
            <VerificationDocumentSection
              verificationId={request._id ?? null}
              verification={request.verification}
            />
          </SheetSection>
        </View>
      )}
    </ScrollView>
  );
};

export default VerificationSheetBody;
