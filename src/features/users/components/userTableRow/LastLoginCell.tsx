import { Text } from "react-native";
import { formatDateTime } from "@/utils/dateFormatter";
import { useUsersPalette } from "../usersTheme";

const LastLoginCell = ({ lastLogin }: { lastLogin: string | null | undefined }) => {
  const palette = useUsersPalette();
  const formatted = formatDateTime(lastLogin);

  if (!lastLogin) {
    return (
      <Text className="text-[13px] font-medium" style={{ color: palette.subtle }}>
        Never
      </Text>
    );
  }

  return (
    <>
      <Text className="text-[13px] font-medium" style={{ color: palette.body }}>
        {formatted.date}
      </Text>
      <Text className="mt-0.5 text-[12px]" style={{ color: palette.subtle }}>
        {formatted.time}
      </Text>
    </>
  );
};

export default LastLoginCell;
