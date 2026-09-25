export type LearnMoreProps = {
  isLearnMoreVisible: boolean;
  onOpenLearnMore: () => void;
  onCloseLearnMore: () => void;
};

export type RegistrationProps = {
  onOpenRegister: () => void;
  isRegistrationVisible: boolean;
  onCloseRegister: () => void;
};

export type LandingScreenProps = LearnMoreProps & RegistrationProps;
