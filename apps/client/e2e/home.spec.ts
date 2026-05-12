import { test, expect } from "@playwright/test";
import { CrudPage } from "./shared/crud-page";


test.describe("Home Page", ()=>{

  test("deve cadastrar o produto", async ({page})=>{
    const productPage = new CrudPage(page);
    await productPage.goTo();
    await  productPage.create();
    await expect(page.getByRole('cell', { name: `descricao ${productPage.descricao}`})).toBeVisible()
  });
});
