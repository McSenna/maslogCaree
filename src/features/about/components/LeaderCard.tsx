import MidTierCard from "./leader/MidTierCard";
import TopTierCard from "./leader/TopTierCard";
import type { LeaderCardProps } from "./leader/leaderCardTypes";

export type { LeaderTier } from "./leader/leaderCardTypes";

const LeaderCard = ({
  title,
  subtitle,
  icon,
  name,
  tier,
  isTablet,
}: LeaderCardProps) => {
  const isTop = tier === "top";
  const avatarSize = isTop ? (isTablet ? 64 : 54) : isTablet ? 52 : 44;
  const displayName = name ?? "— Unassigned —";

  const tierProps = { title, subtitle, icon, isTablet, avatarSize, displayName };

  return isTop ? <TopTierCard {...tierProps} /> : <MidTierCard {...tierProps} />;
};

export default LeaderCard;
