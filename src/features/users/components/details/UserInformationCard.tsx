import type { AdminUser } from "@/features/users/services/userService";
import DetailCard from "./DetailCard";
import { InfoRows, buildAccountRows, buildPersonalRows } from "./userDetailRows";

const UserInformationCard = ({ user }: { user: AdminUser }) => {
  return (
    <DetailCard icon="user" title="Personal Information" grow>
      <InfoRows rows={[...buildPersonalRows(user), ...buildAccountRows(user)]} />
    </DetailCard>
  );
};

export default UserInformationCard;
