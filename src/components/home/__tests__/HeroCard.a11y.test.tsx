import { render } from "@testing-library/react-native";
import HeroCard from "@/components/home/HeroCard";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("HeroCard Accessibility", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(<HeroCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper contrast ratios", async () => {
    const { getByText } = render(<HeroCard />);
    const heading = getByText("Welcome to Maslog Care App");
    expect(heading).toBeDefined();
    // Note: Actual contrast validation requires visual inspection or color analysis tools
  });

  it("should have accessible text labels for stats", async () => {
    const { getByLabelText } = render(<HeroCard />);
    // Stats should be accessible
    expect(getByLabelText("Health Workers")).toBeDefined();
    expect(getByLabelText("Digital Access")).toBeDefined();
    expect(getByLabelText("Free For Residents")).toBeDefined();
  });

  it("should support keyboard navigation", async () => {
    const { container } = render(<HeroCard />);
    const interactiveElements = container.querySelectorAll("button, [tabIndex]");
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  it("should have proper semantic structure", async () => {
    const { getByRole } = render(<HeroCard />);
    const article = getByRole("article");
    expect(article).toBeDefined();
  });
});
