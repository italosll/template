
import { test as setup } from '@playwright/test';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import path from 'path';
import { mock } from "mock-require";

const authFile = path.resolve(__dirname, 'user.json');



setup('authenticate', async ({ page }) => {
  await page.goto("/entrar");
  await page.getByRole('textbox', { name: 'email' }).click();
  await page.getByRole('textbox', { name: 'email' }).fill('italomsilva.if@gmail.com');
  await page.getByRole('textbox', { name: 'password' }).click();
  await page.getByRole('textbox', { name: 'password' }).fill('teste12345678');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL("/inicio")
  await page.context().storageState({ path: authFile });
});

