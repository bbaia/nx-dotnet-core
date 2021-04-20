import { dotnet } from '../../utils';
import { RestoreExecutorSchema } from './schema';

export default async function runExecutor(
  options: RestoreExecutorSchema,
): Promise<{ success: boolean }> {
  const { project } = options;
  return dotnet.restore(project);
}
