import { dotnet } from '../../utils';
import { TestExecutorSchema } from './schema';

export default async function runExecutor(
  options: TestExecutorSchema,
): Promise<{ success: boolean }> {
  const { project, watch, noRestore } = options;
  return watch
    ? dotnet.watch(project, 'test', noRestore)
    : dotnet.test(project, noRestore);
}
