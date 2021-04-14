import { dotnet } from '../../utils';
import { ServeExecutorSchema } from './schema';

export default async function runExecutor(
  options: ServeExecutorSchema,
): Promise<{ success: boolean }> {
  const { project, verbose } = options;
  return dotnet.watch(project, 'run', verbose);
}
