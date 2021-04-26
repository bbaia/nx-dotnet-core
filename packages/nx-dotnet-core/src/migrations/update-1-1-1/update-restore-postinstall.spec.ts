import { join } from 'path';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

describe('Should replace "nx affected" with "nx run-many" in postinstall script', () => {
  const migrationTestRunner = new SchematicTestRunner(
    '@bbaia/nx-dotnet-core',
    join(__dirname, '../../../migrations.json'),
  );

  [
    {
      test: 'nx affected --target=restore --all',
      expected: 'nx run-many --target=restore --all',
    },
    {
      test: 'echo "hi" && nx affected --target=restore --all',
      expected: 'echo "hi" && nx run-many --target=restore --all',
    },
    {
      test: 'nx restore --all',
      expected: 'nx restore --all',
    },
  ].forEach(testEntry => {
    it(`for: "${testEntry.test}"`, async () => {
      const tree = createEmptyWorkspace(Tree.empty());
      tree.overwrite(
        '/package.json',
        JSON.stringify({
          scripts: {
            postinstall: testEntry.test,
          },
        }),
      );

      const result = await migrationTestRunner
        .runSchematicAsync('update-restore-postinstall', {}, tree)
        .toPromise();

      const packageJson = JSON.parse(result.read('/package.json').toString());
      expect(packageJson.scripts.postinstall).toEqual(testEntry.expected);
    });
  });
});
