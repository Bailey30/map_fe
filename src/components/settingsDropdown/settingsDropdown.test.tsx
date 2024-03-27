import userEvent from "@testing-library/user-event";
import Navbar from "../navbar/navbar";
import { screen } from "@testing-library/react";
import { render } from "@/utils/testUtils";
import MapComponent from "../map/Map";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "pathname"),
}));

// jest.mock("@/redux/hooks", () => ({
//   ...jest.requireActual("@/redux/hooks"),
//   useAppDispatch: jest.fn(),
// }));

describe("settingsDropdown tests", () => {
  const testSession = {
    user: { email: "test", id: 1 },
    expires: "2024-04-25T10:16:35.736Z",
  };

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

  // test("should hide display settings dropdown when map is clicked on ", async () => {
  //   // not wokring because "Map is not supported by this browser"
  //   // something to do with the testId on the Map componenet from mapbox - it cant find it
  //   // render(<Navbar session={testSession} />);
  //   // render(<MapComponent data={[]} />);
  //   //
  //   // await userEvent.click(screen.getByAltText("Settings icon"));
  //   // await userEvent.click(screen.getByTestId("map"));
  //   //
  //   // expect(screen.getByTestId("settingsDropdownId")).not.toBeInTheDocument();
  // });
});
