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

/**
 * Default HeroCard: Mobile view (responsive)
 */
export const Default: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/**
 * Tablet view: Larger typography and spacing
 */
export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

/**
 * Desktop view: Maximum scale with comfortable reading distance
 */
export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "ipad" },
  },
};

/**
 * High contrast variant for accessibility testing
 */
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

/**
 * Focused state for keyboard navigation testing
 */
export const FocusedState: Story = {
  parameters: {
    docs: {
      description: {
        story: "Shows focus state for accessibility and keyboard navigation.",
      },
    },
  },
};
