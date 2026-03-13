import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DateSeparator } from "./date-separator";

describe("DateSeparator", () => {
  it("should render the label", () => {
    render(<DateSeparator label="today" />);

    expect(screen.getByText("today")).toBeVisible();
  });
});
