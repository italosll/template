import { getJestProjectsAsync } from "@nx/jest";
import { pathsToModuleNameMapper } from "ts-jest";

export default async () => ({
  projects: await getJestProjectsAsync(),
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
});
