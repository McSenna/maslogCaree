import { View } from "react-native";
import type { UserRequestSummary } from "../../services/userRequestsService";
import RequestRow from "./table/RequestRow";
import RequestsTableHeader from "./table/RequestsTableHeader";

type UserRequestsTableProps = {
  requests: UserRequestSummary[];
  onReview: (requestId: string) => void;
};

const UserRequestsTable = ({ requests, onReview }: UserRequestsTableProps) => {
  return (
    <View className="w-full">
      <RequestsTableHeader />

      {requests.map((request, index) => (
        <RequestRow
          key={request._id}
          request={request}
          isLast={index === requests.length - 1}
          onReview={() => onReview(request._id)}
        />
      ))}
    </View>
  );
};

export default UserRequestsTable;
