const { getJestProjectsAsync } = require("@nx/jest");
const { pathsToModuleNameMapper } = require("ts-jest");

module.exports = async () => ({
  projects: await getJestProjectsAsync(),
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
});
