import { dotnet } from '../../utils';
import { TestExecutorSchema } from './schema';

export default async function runExecutor(
  options: TestExecutorSchema,
): Promise<{ success: boolean }> {
  const { project, watch } = options;
  return watch ? dotnet.watch(project, 'test') : dotnet.test(project);
}
