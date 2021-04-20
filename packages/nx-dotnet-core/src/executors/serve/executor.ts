import { dotnet } from '../../utils';
import { ServeExecutorSchema } from './schema';

export default async function runExecutor(
  options: ServeExecutorSchema,
): Promise<{ success: boolean }> {
  const { project, noRestore, verbose } = options;
  return dotnet.watch(project, 'run', noRestore, verbose);
}
