import { test, expect, Page } from "@playwright/test";
import { CrudPage } from "./shared/crud-page";
import * as path from "node:path";
import { BrowserContext } from "playwright";



test.describe.serial("Product Page", ()=>{

function getUniqueId(){
    return Math.random().toString(36).substring(2, 10);
  }
  let descricao = null
  let page:Page;
  let context: BrowserContext;

  test.beforeAll(async ({browser}) => {
    context = await browser.newContext();
    page = await context.newPage();
    descricao = getUniqueId();
  })

  test("deve cadastrar o produto", async ()=>{
    const productPage = new CrudPage(page);
    await productPage.goTo();

    const filePath = path.resolve(process.cwd(), 'e2e/assets/image_test.png');
    await page.getByRole('button', { name: 'Novo' }).click();
    await page.getByTestId('file-input').setInputFiles(filePath);
    await page.getByRole('textbox', { name: 'codigo' }).fill(`codigo ${descricao}`);
    await page.getByRole('textbox', { name: 'descricao' }).fill(`descricao ${descricao}`);
    await page.getByRole('textbox', { name: 'nome' }).fill('nome');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.getByRole('cell', { name: descricao})

    await expect(page.getByRole('cell', { name: `descricao ${descricao}`})).toBeVisible()
  });

  test("deve deletar o produto", async ()=>{
    const productPage = new CrudPage(page);
    await productPage.goTo();
    await page.getByRole('textbox', { name: 'Pesquisar' }).click();
    await page.getByRole('textbox', { name: 'Pesquisar' }).fill(descricao);
    await page.waitForRequest(request =>
      request.url().includes("**/api/products**") && request.method() === 'GET'
    )

    // await page.waitForTimeout(300);
    // eslint-disable-next-line playwright/no-networkidle
    // await page.waitForLoadState("networkidle");
    await page.getByTestId('checkbox').click()
    await page.getByRole('button', { name: 'Deletar' }).click()
    await page.getByRole('button', { name: 'Sim, deletar' }).click();
    // await page.waitForTimeout(300);

    // eslint-disable-next-line playwright/no-networkidle
    // await page.waitForLoadState("networkidle");
    await expect(page.getByRole('cell', { name: `descricao ${descricao}`})).toBeNull()
  });
});
