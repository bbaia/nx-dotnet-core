import { names } from '@nrwl/devkit';
import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('new e2e', () => {
  it(`should create new application based on 'webapi' template`, async () => {
    const plugin = uniq('api');
    ensureNxProject('@bbaia/nx-dotnet-core', 'dist/packages/nx-dotnet-core');
    await runNxCommandAsync(
      `generate @bbaia/nx-dotnet-core:new app webapi ${plugin}`,
    );
    expect(() =>
      checkFilesExist(
        `apps/${plugin}/src/Controllers/WeatherForecastController.cs`,
        `apps/${plugin}/src/appsettings.json`,
        `apps/${plugin}/src/Program.cs`,
        `apps/${plugin}/src/Startup.cs`,
        `apps/${plugin}/src/WeatherForecast.cs`,
        `apps/${plugin}/src/${names(plugin).className}.csproj`,
        `apps/${plugin}/${names(plugin).className}.sln`,
        `apps/${plugin}/.gitignore`,
        `apps/${plugin}/README.md`,
      ),
    ).not.toThrow();

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(() =>
      checkFilesExist(
        `dist/packages/${plugin}/${names(plugin).className}.dll`,
        `dist/packages/${plugin}/web.config`,
      ),
    ).not.toThrow();
  }, 50000);

  it(`should create new library based on 'classlib' template`, async () => {
    const plugin = uniq('lib');
    ensureNxProject('@bbaia/nx-dotnet-core', 'dist/packages/nx-dotnet-core');
    await runNxCommandAsync(
      `generate @bbaia/nx-dotnet-core:new lib classlib ${plugin}`,
    );
    expect(() =>
      checkFilesExist(
        `libs/${plugin}/src/Class1.cs`,
        `libs/${plugin}/src/${names(plugin).className}.csproj`,
        `libs/${plugin}/${names(plugin).className}.sln`,
        `libs/${plugin}/.gitignore`,
        `libs/${plugin}/README.md`,
      ),
    ).not.toThrow();

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(() =>
      checkFilesExist(`dist/packages/${plugin}/${names(plugin).className}.dll`),
    ).not.toThrow();
  }, 50000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('api');
      ensureNxProject('@bbaia/nx-dotnet-core', 'dist/packages/nx-dotnet-core');
      await runNxCommandAsync(
        `generate @bbaia/nx-dotnet-core:new app webapi ${plugin} --directory subdir`,
      );
      expect(() =>
        checkFilesExist(
          `apps/subdir/${plugin}/src/${names(plugin).className}.csproj`,
          `apps/subdir/${plugin}/${names(plugin).className}.sln`,
          `apps/subdir/${plugin}/.gitignore`,
          `apps/subdir/${plugin}/README.md`,
        ),
      ).not.toThrow();
    }, 50000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('lib');
      ensureNxProject('@bbaia/nx-dotnet-core', 'dist/packages/nx-dotnet-core');
      await runNxCommandAsync(
        `generate @bbaia/nx-dotnet-core:new lib classlib ${plugin} --tags e2etag,e2ePackage`,
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 50000);
  });

  describe('--unitTestTemplate', () => {
    it('should add unit tests', async () => {
      const plugin = uniq('api');
      ensureNxProject('@bbaia/nx-dotnet-core', 'dist/packages/nx-dotnet-core');
      await runNxCommandAsync(
        `generate @bbaia/nx-dotnet-core:new app webapi ${plugin} --unitTestTemplate nunit`,
      );
      expect(() =>
        checkFilesExist(
          `apps/${plugin}/tests/UnitTest1.cs`,
          `apps/${plugin}/tests/${names(plugin).className}.Tests.csproj`,
          `apps/${plugin}/src/${names(plugin).className}.csproj`,
          `apps/${plugin}/${names(plugin).className}.sln`,
          `apps/${plugin}/.gitignore`,
          `apps/${plugin}/README.md`,
        ),
      ).not.toThrow();

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(result.stdout).toContain('Passed!');
    }, 50000);
  });
});
