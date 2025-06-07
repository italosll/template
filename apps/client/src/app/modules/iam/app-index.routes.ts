/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
import { RoutesContract } from "@client/common/contracts/routes.contract";

export function getIamRoutes() {
  const client = {
    signIn: {
      path: "entrar",
      title: "Entrar",
    },
    signUp: {
      path: "criar-conta",
      title: "Criar Conta",
    },
  };

  const api = {
    signIn: `/api/authentication/sign-in`,
    signUp: `/api/authentication/sign-up`,
    signOut: `/api/authentication/sign-out`,
  } as const;

  const angular: Route[] = [
    {
      title: client.signIn.title,
      path: client.signIn.path,
      loadComponent: () =>
        import("@client/iam/pages/app-page-sign-in.component").then(
          (m) => m.PageSignInComponent
        ),
    },
    {
      title: client.signUp.title,
      path: client.signUp.path,
      loadComponent: () =>
        import("@client/iam/pages/app-page-sign-up.component").then(
          (m) => m.PageSignInComponent
        ),
    },
  ];

  return {
    client,
    api,
    angular,
  } satisfies RoutesContract;
}
