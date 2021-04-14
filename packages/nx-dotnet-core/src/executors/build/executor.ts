import { dotnet } from '../../utils';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: BuildExecutorSchema,
): Promise<{ success: boolean }> {
  const { project, outputPath, configuration } = options;
  return dotnet.publish(project, outputPath, configuration);
}
