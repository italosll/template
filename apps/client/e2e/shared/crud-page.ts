import { Page } from "@playwright/test";
import * as path from "node:path";
import { getProductsRoutes } from "../../src/app/modules/products/app-index.routes";

export class CrudPage {
  descricao = `descricao ${this.getUniqueId()}`;

  constructor(private page: Page) {}

  private getUniqueId(){
    return Math.random().toString(36).substring(2, 10);
  }

  async goTo(){
    // await this.page.goto("estoque", { waitUntil:"domcontentloaded"});
    await this.page.goto(getProductsRoutes().client.products, { waitUntil:"domcontentloaded"});

  }

  async create(){
    const filePath = path.resolve(process.cwd(), 'e2e/assets/image_test.png');
    await this.page.getByRole('button', { name: 'Novo' }).click();
    await this.page.getByTestId('file-input').setInputFiles(filePath);
    await this.page.getByRole('textbox', { name: 'codigo' }).fill(`codigo ${this.descricao}`);
    await this.page.getByRole('textbox', { name: 'descricao' }).fill(`descricao ${this.descricao}`);
    await this.page.getByRole('textbox', { name: 'nome' }).fill('nome');
    await this.page.getByRole('button', { name: 'Salvar' }).click();
    await this.page.getByRole('cell', { name: this.descricao})
  }

  async delete(){
    await this.page.getByRole('textbox', { name: 'Pesquisar' }).click();
    await this.page.getByRole('textbox', { name: 'Pesquisar' }).fill('descricao');
    await this.page.waitForRequest(request =>
      request.url().includes("/api/products") && request.method() === 'GET'
    )
    await this.page.getByTestId('checkbox').click()
    await this.page.getByRole('button', { name: 'Deletar' })

  }



  // acessar pagina
  // cadastrar novo registro
  // verificar novo registro na tabela
  // atualizar registro
  // ver registro atualizado na tela
  // deletar registro
  // registro não deve mais estar na tabela.

}
