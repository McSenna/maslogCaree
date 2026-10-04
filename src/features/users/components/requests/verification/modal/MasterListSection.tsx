import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PALETTE } from "@/theme/palette";

import type { UserRequestDetail } from "../../../../services/userRequestsService";
import MasterListCheckCard from "../../masterList/MasterListCheckCard";

type Props = {
  request: UserRequestDetail;
};

const MasterListSection = ({ request }: Props) => (
  <View className="gap-4">
    <View className="flex-row items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
      <Feather name="list" size={15} color={PALETTE.blue[600]} />
      <Text
        accessibilityRole="header"
        className="text-[14px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider"
      >
        Barangay Master List
      </Text>
    </View>
    <MasterListCheckCard
      review={request.masterList}
      resident={request.resident}
      isPending={request.verification.verificationStatus === "pending"}
    />
  </View>
);

export default MasterListSection;
