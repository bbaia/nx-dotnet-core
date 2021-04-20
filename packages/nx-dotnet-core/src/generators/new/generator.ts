import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
  ProjectType,
  readWorkspaceConfiguration,
  TargetConfiguration,
  Tree,
  updateJson,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';

import { dotnet } from '../../utils';
import { NewGeneratorSchema } from './schema';

interface NormalizedSchema extends NewGeneratorSchema {
  projectType: ProjectType;
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: NewGeneratorSchema,
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectType = options.type === 'app' ? 'application' : 'library';
  const workspaceDirectory =
    options.type === 'app'
      ? getWorkspaceLayout(host).appsDir
      : getWorkspaceLayout(host).libsDir;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${workspaceDirectory}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map(s => s.trim())
    : [];

  return {
    ...options,
    projectType,
    projectName,
    projectRoot,
    parsedTags,
  };
}

function getRestoreConfig(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@bbaia/nx-dotnet-core:restore',
    options: {
      project: `${options.projectRoot}`,
    },
  };
}

function getBuildConfig(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@bbaia/nx-dotnet-core:build',
    outputs: ['{options.outputPath}'],
    options: {
      project: `${options.projectRoot}/src`,
      outputPath: `dist/packages/${options.projectName}`,
    },
    configurations: {
      production: {
        configuration: 'Release',
      },
    },
  };
}

function getServeConfig(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@bbaia/nx-dotnet-core:serve',
    options: {
      project: `${options.projectRoot}/src`,
    },
  };
}

function getTestConfig(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@bbaia/nx-dotnet-core:test',
    options: {
      project: `${options.projectRoot}/tests`,
    },
    configurations: {
      watch: {
        watch: true,
      },
    },
  };
}

function addProject(host: Tree, options: NormalizedSchema) {
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: options.projectRoot,
    projectType: options.projectType,
    sourceRoot: `${options.projectRoot}/src`,
    targets: {},
    tags: options.parsedTags,
  };
  project.targets.restore = getRestoreConfig(options);
  if (options.projectType === 'application') {
    project.targets.serve = getServeConfig(options);
  }
  project.targets.build = getBuildConfig(options);
  if (options.unitTestTemplate) {
    project.targets.test = getTestConfig(options);
  }

  addProjectConfiguration(host, options.projectName, project);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject && options.projectType === 'application') {
    workspace.defaultProject = options.name;
    updateWorkspaceConfiguration(host, workspace);
  }
}

async function addDotNetSolution(host: Tree, options: NormalizedSchema) {
  const slnName = names(options.name).className;
  const slnPath = options.projectRoot;
  const srcProjectName = slnName;
  const srcProjectPath = `${options.projectRoot}/src`;
  await dotnet.new('gitignore', options.projectRoot);
  await dotnet.new('sln', slnPath, slnName);
  await dotnet.new(options.template, srcProjectPath, srcProjectName);
  await dotnet.addProjectToSolution(slnPath, srcProjectPath);

  if (options.unitTestTemplate) {
    const testsProjectName = `${srcProjectName}.Tests`;
    const testsProjectPath = `${options.projectRoot}/tests`;
    await dotnet.new(
      options.unitTestTemplate,
      testsProjectPath,
      testsProjectName,
    );
    await dotnet.addProjectReference(testsProjectPath, srcProjectPath);
    await dotnet.addProjectToSolution(slnPath, testsProjectPath);
  }
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    canServe: options.projectType === 'application',
    hasUnitTests: !!options.unitTestTemplate,
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions,
  );
}

function addVsCodeExtension(host: Tree) {
  if (!host.exists('.vscode/extensions.json')) {
    return;
  }

  updateJson(host, '.vscode/extensions.json', json => {
    json.recommendations = json.recommendations || [];
    const extension = 'ms-dotnettools.csharp';
    if (!json.recommendations.includes(extension)) {
      json.recommendations.push(extension);
    }
    return json;
  });
}

function addPostInstall(host: Tree) {
  updateJson(host, 'package.json', json => {
    json.scripts = json.scripts || {};
    const command = json.scripts.ng
      ? 'nx affected --target=restore --all'
      : 'nx restore --all';
    if (!json.scripts.postinstall) {
      json.scripts.postinstall = command;
    } else if (!json.scripts.postinstall.includes(command)) {
      json.scripts.postinstall = `${json.scripts.postinstall} && ${command}`;
    }
    return json;
  });
}

export default async function (host: Tree, options: NewGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  addProject(host, normalizedOptions);
  await addDotNetSolution(host, normalizedOptions);
  addFiles(host, normalizedOptions);
  addVsCodeExtension(host);
  addPostInstall(host);
  await formatFiles(host);
}
