import userEvent from "@testing-library/user-event";
import Navbar from "../navbar/navbar";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "pathname"),
}));

describe("settingsDropdown tests", () => {
  test("should display settings dropdown when settings icon clicked", async () => {
    render(
      <Navbar
        session={{
          user: { email: "test", id: 1 },
          expires: "2024-04-25T10:16:35.736Z",
        }}
      />,
    );

    await userEvent.click(screen.getByAltText("Settings icon"));

    await screen.findByRole("menu");

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
