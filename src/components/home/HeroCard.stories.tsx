import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import HeroCard from "@/components/home/HeroCard";

const meta = {
  title: "Components/HeroCard",
  component: HeroCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#F8FAFC" }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Hero card component showcasing welcome message, platform tagline, and key statistics (health workers, digital access, free service).",
      },
    },
  },
} satisfies Meta<typeof HeroCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "ipad" },
  },
};

export const HighContrast: Story = {
  parameters: {
    theme: "dark",
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
};

export const FocusedState: Story = {
  parameters: {
    docs: {
      description: {
        story: "Shows focus state for accessibility and keyboard navigation.",
      },
    },
  },
};
