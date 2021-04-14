import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  NxJsonConfiguration,
  readJson,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

import { dotnet } from '../../utils';
import generator from './generator';
import { NewGeneratorSchema } from './schema';

describe('new generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    dotnet.new = jest.fn(() => Promise.resolve({ success: true }));
    dotnet.addProjectReference = jest.fn(() =>
      Promise.resolve({ success: true }),
    );
    dotnet.addProjectToSolution = jest.fn(() =>
      Promise.resolve({ success: true }),
    );
  });

  describe('application', () => {
    it('should generate dotnet solution', async () => {
      const options: NewGeneratorSchema = {
        type: 'app',
        template: 'webapi',
        name: 'my-app',
      };

      await generator(tree, options);

      expect(dotnet.new).toHaveBeenCalledTimes(3);
      expect(dotnet.new).toHaveBeenCalledWith('gitignore', 'apps/my-app');
      expect(dotnet.new).toHaveBeenCalledWith('sln', 'apps/my-app', 'MyApp');
      expect(dotnet.new).toHaveBeenCalledWith(
        'webapi',
        'apps/my-app/src',
        'MyApp',
      );
      expect(dotnet.addProjectReference).toHaveBeenCalledTimes(0);
      expect(dotnet.addProjectToSolution).toHaveBeenCalledTimes(1);
    });

    it('should generate files', async () => {
      const options: NewGeneratorSchema = {
        type: 'app',
        template: 'webapi',
        name: 'my-app',
      };

      await generator(tree, options);

      expect(tree.exists('apps/my-app/README.md')).toBeTruthy();
      expect(tree.read('apps/my-app/README.md').toString())
        .toMatchInlineSnapshot(`
      "# my-app

      This application was generated with [Nx](https://nx.dev) and the [.NET Core plugin](https://github.com/bbaia/nx-dotnet-core).


      ## Development server

      Run \`ng serve my-app\` to serve the app. The app will automatically reload if you change any of the source files.


      ## Build

      Run \`ng build my-app\` to build the project. The build artifacts will be stored in the \`dist/\` directory. Use the \`--prod\` flag for a production build.

      "
    `);
    });

    it('should update workspace.json', async () => {
      const options: NewGeneratorSchema = {
        type: 'app',
        template: 'webapi',
        name: 'my-app',
      };

      await generator(tree, options);

      const config = readProjectConfiguration(tree, 'my-app');
      expect(config).toBeDefined();
      expect(config).toEqual({
        projectType: 'application',
        root: 'apps/my-app',
        sourceRoot: 'apps/my-app/src',
        tags: [],
        targets: {
          build: {
            executor: '@bbaia/nx-dotnet-core:build',
            outputs: ['{options.outputPath}'],
            options: {
              outputPath: 'dist/packages/my-app',
              project: 'apps/my-app/src',
            },
            configurations: {
              production: {
                configuration: 'Release',
              },
            },
          },
          serve: {
            executor: '@bbaia/nx-dotnet-core:serve',
            options: {
              project: 'apps/my-app/src',
            },
          },
        },
      });

      const workspaceJson = readJson(tree, '/workspace.json');
      expect(workspaceJson.projects['my-app'].root).toEqual('apps/my-app');
      expect(workspaceJson.defaultProject).toEqual('my-app');
    });

    it('should update nx.json', async () => {
      const options: NewGeneratorSchema = {
        type: 'app',
        template: 'webapi',
        name: 'my-app',
      };

      await generator(tree, options);

      const nxJson = readJson<NxJsonConfiguration>(tree, '/nx.json');
      expect(nxJson.projects).toEqual({
        'my-app': { tags: [] },
      });
    });
  });

  describe('library', () => {
    it('should generate dotnet solution', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
      };

      await generator(tree, options);

      expect(dotnet.new).toHaveBeenCalledTimes(3);
      expect(dotnet.new).toHaveBeenCalledWith('gitignore', 'libs/my-lib');
      expect(dotnet.new).toHaveBeenCalledWith('sln', 'libs/my-lib', 'MyLib');
      expect(dotnet.new).toHaveBeenCalledWith(
        'classlib',
        'libs/my-lib/src',
        'MyLib',
      );
      expect(dotnet.addProjectReference).toHaveBeenCalledTimes(0);
      expect(dotnet.addProjectToSolution).toHaveBeenCalledTimes(1);
    });

    it('should generate files', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
      };

      await generator(tree, options);

      expect(tree.exists('libs/my-lib/README.md')).toBeTruthy();
      expect(tree.read('libs/my-lib/README.md').toString())
        .toMatchInlineSnapshot(`
      "# my-lib

      This library was generated with [Nx](https://nx.dev) and the [.NET Core plugin](https://github.com/bbaia/nx-dotnet-core).


      ## Build

      Run \`ng build my-lib\` to build the project. The build artifacts will be stored in the \`dist/\` directory. Use the \`--prod\` flag for a production build.

      "
    `);
    });

    it('should update workspace.json', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
      };

      await generator(tree, options);

      const config = readProjectConfiguration(tree, 'my-lib');
      expect(config).toBeDefined();
      expect(config).toEqual({
        projectType: 'library',
        root: 'libs/my-lib',
        sourceRoot: 'libs/my-lib/src',
        tags: [],
        targets: {
          build: {
            executor: '@bbaia/nx-dotnet-core:build',
            outputs: ['{options.outputPath}'],
            options: {
              outputPath: 'dist/packages/my-lib',
              project: 'libs/my-lib/src',
            },
            configurations: {
              production: {
                configuration: 'Release',
              },
            },
          },
        },
      });

      const workspaceJson = readJson(tree, '/workspace.json');
      expect(workspaceJson.projects['my-lib'].root).toEqual('libs/my-lib');
      expect(workspaceJson.defaultProject).toBeUndefined();
    });

    it('should update nx.json', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
      };

      await generator(tree, options);

      const nxJson = readJson<NxJsonConfiguration>(tree, '/nx.json');
      expect(nxJson.projects).toEqual({
        'my-lib': { tags: [] },
      });
    });
  });

  describe('--unitTestTemplate', () => {
    it('should generate dotnet solution', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
        unitTestTemplate: 'nunit',
      };

      await generator(tree, options);

      expect(dotnet.new).toHaveBeenCalledTimes(4);
      expect(dotnet.new).toHaveBeenCalledWith('gitignore', 'libs/my-lib');
      expect(dotnet.new).toHaveBeenCalledWith('sln', 'libs/my-lib', 'MyLib');
      expect(dotnet.new).toHaveBeenCalledWith(
        'classlib',
        'libs/my-lib/src',
        'MyLib',
      );
      expect(dotnet.new).toHaveBeenCalledWith(
        'nunit',
        'libs/my-lib/tests',
        'MyLib.Tests',
      );
      expect(dotnet.addProjectReference).toHaveBeenCalledTimes(1);
      expect(dotnet.addProjectToSolution).toHaveBeenCalledTimes(2);
    });

    it('should generate files', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
        unitTestTemplate: 'nunit',
      };

      await generator(tree, options);

      expect(tree.exists('libs/my-lib/README.md')).toBeTruthy();
      expect(tree.read('libs/my-lib/README.md').toString())
        .toMatchInlineSnapshot(`
        "# my-lib

        This library was generated with [Nx](https://nx.dev) and the [.NET Core plugin](https://github.com/bbaia/nx-dotnet-core).


        ## Build

        Run \`ng build my-lib\` to build the project. The build artifacts will be stored in the \`dist/\` directory. Use the \`--prod\` flag for a production build.


        ## Running unit tests

        Run \`nx test my-lib\` to execute the unit tests via \`nunit\`. Use the \`--watch\` flag to watch files for changes and rerun tests.

        "
      `);
    });

    it('should update workspace.json', async () => {
      const options: NewGeneratorSchema = {
        type: 'lib',
        template: 'classlib',
        name: 'my-lib',
        unitTestTemplate: 'nunit',
      };

      await generator(tree, options);

      const config = readProjectConfiguration(tree, 'my-lib');
      expect(config).toBeDefined();
      expect(config).toEqual(
        expect.objectContaining({
          projectType: 'library',
          root: 'libs/my-lib',
          sourceRoot: 'libs/my-lib/src',
          targets: expect.objectContaining({
            test: {
              executor: '@bbaia/nx-dotnet-core:test',
              options: {
                project: 'libs/my-lib/tests',
              },
              configurations: {
                watch: {
                  watch: true,
                },
              },
            },
          }),
        }),
      );
    });
  });
});
