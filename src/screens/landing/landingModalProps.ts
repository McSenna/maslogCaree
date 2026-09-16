export type LearnMoreProps = {
  isLearnMoreVisible: boolean;
  onOpenLearnMore: () => void;
  onCloseLearnMore: () => void;
};

export type LandingScreenProps = LearnMoreProps & {
  onOpenRegister: () => void;
  isRegistrationVisible: boolean;
  onCloseRegister: () => void;
};
