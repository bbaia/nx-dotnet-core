import * as childProcess from 'child_process';

async function spawn(args: string[]): Promise<{ success: boolean }> {
  const process = childProcess.spawn('dotnet', args, { stdio: 'inherit' });
  return new Promise<{ success: boolean }>(resolve => {
    process.on('close', code => {
      resolve({ success: code === 0 });
    });
  });
}

async function dotnetNew(
  template: string,
  outputPath: string,
  outputName?: string,
): Promise<{ success: boolean }> {
  const args = ['--output', outputPath];
  if (outputName) {
    args.push('--name');
    args.push(outputName);
  }
  return dotnet.spawn(['new', template, ...args]);
}

async function addProjectReference(
  projectPath: string,
  projectReferencePath: string,
): Promise<{ success: boolean }> {
  return dotnet.spawn(['add', projectPath, 'reference', projectReferencePath]);
}

async function addProjectToSolution(
  solutionPath: string,
  projectPath: string,
): Promise<{ success: boolean }> {
  return dotnet.spawn(['sln', solutionPath, 'add', projectPath]);
}

async function watch(
  project: string,
  command: 'run' | 'test',
  verbose = false,
): Promise<{ success: boolean }> {
  const args = ['watch'];
  if (verbose) {
    args.push('--verbose');
  }
  args.push('--project');
  args.push(project);
  args.push(command);
  return dotnet.spawn(args);
}

async function publish(
  project: string,
  outputPath?: string,
  configuration?: string,
): Promise<{ success: boolean }> {
  const args = ['publish', '--nologo'];
  if (outputPath) {
    args.push('--output');
    args.push(outputPath);
  }
  if (configuration) {
    args.push('--configuration');
    args.push(configuration);
  }
  args.push(project);
  return dotnet.spawn(args);
}

async function test(project: string): Promise<{ success: boolean }> {
  const args = ['test', '--nologo'];
  args.push(project);
  return dotnet.spawn(args);
}

export const dotnet = {
  spawn,
  new: dotnetNew,
  addProjectReference,
  addProjectToSolution,
  watch,
  publish,
  test,
};
