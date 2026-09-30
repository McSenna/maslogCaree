import { Share } from "react-native";

/**
 * Phones have no download folder to write to without extra file-system
 * packages, so the CSV goes to the system share sheet (Files, Drive, email).
 */
export const exportAnnouncementsCsv = async (csv: string, fileName: string): Promise<void> => {
  await Share.share({ title: fileName, message: csv });
};
