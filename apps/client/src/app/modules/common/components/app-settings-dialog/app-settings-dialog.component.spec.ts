import { render } from "@testing-library/angular";
import { SettingsDialogComponent } from "./app-settings-dialog.component";

describe("app-settings-dialog", () => {
  async function setup() {
    const component = await render(SettingsDialogComponent);

    return { ...component };
  }

  it("should render", async () => {
    const { fixture } = await setup();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
