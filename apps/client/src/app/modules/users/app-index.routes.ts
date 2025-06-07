/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
import { RoutesContract } from "@client/common/contracts/routes.contract";

export function getUsersRoutes() {
  const client = {
    users: {
      title: "Usuários",
      path: "usuarios",
      icon: "people",
    },
  };

  const api = {};

  const angular: Route[] = [
    {
      title: client.users.title,
      path: client.users.path,
      loadComponent: () =>
        import("@client/users/pages/app-page-users.component").then(
          (m) => m.PageUsersComponent
        ),
    },
  ];

  return {
    client,
    api,
    angular,
  } satisfies RoutesContract;
}
