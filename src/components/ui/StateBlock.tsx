import type { Feather } from "@expo/vector-icons";
import FeedbackState from "@/components/feedback/FeedbackState";
import { friendlyErrorMessage } from "@/utils/friendlyError";

export type StateBlockProps = {
  icon: keyof typeof Feather.glyphMap;
  tone: "neutral" | "error";
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

const StateBlock = ({ icon, tone, title, body, action }: StateBlockProps) => (
  <FeedbackState
    icon={icon}
    tone={tone}
    title={title}
    description={tone === "error" ? friendlyErrorMessage(body) : body}
    action={action}
  />
);

export default StateBlock;
