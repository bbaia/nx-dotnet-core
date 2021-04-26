import { chain, SchematicContext, Tree } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { formatFiles } from '@nrwl/workspace';

const udpateRestorePostinstallScript = (
  host: Tree,
  context: SchematicContext,
) => {
  updateJsonInTree('package.json', json => {
    if (
      json.scripts &&
      json.scripts.postinstall &&
      json.scripts.postinstall.includes('nx affected --target=restore --all')
    ) {
      json.scripts.postinstall = json.scripts.postinstall.replace(
        /(.*)(nx affected --target=restore --all)(.*)/,
        '$1nx run-many --target=restore --all$3',
      );
    }
    return json;
  })(host, context);
};

export default function () {
  return chain([udpateRestorePostinstallScript, formatFiles()]);
}
