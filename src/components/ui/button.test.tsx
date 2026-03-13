import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Button } from "./button";

const setup = (props?: Partial<React.ComponentProps<typeof Button>>) => {
  const defaults = {
    children: "Click me",
  };

  return render(<Button {...defaults} {...props} />);
};

describe("Button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default variant", () => {
    setup();

    expect(screen.getByRole("button", { name: "Click me" })).toBeVisible();
  });

  it("should apply custom className", () => {
    const customClass = "my-custom-class";
    setup({ className: customClass });

    expect(screen.getByRole("button")).toHaveClass(customClass);
  });
});
