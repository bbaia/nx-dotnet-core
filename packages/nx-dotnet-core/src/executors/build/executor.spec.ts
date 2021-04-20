import { dotnet } from '../../utils';
import executor from './executor';
import { BuildExecutorSchema } from './schema';

describe('Build Executor', () => {
  beforeEach(() => {
    dotnet.publish = jest.fn(() => Promise.resolve({ success: true }));
  });

  it('should call dotnet publish', async () => {
    const options: BuildExecutorSchema = {
      project: 'my-app',
      outputPath: 'dist/my-app',
      configuration: 'DEBUG',
      noRestore: false,
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(dotnet.publish).toBeCalledTimes(1);
    expect(dotnet.publish).toBeCalledWith(
      options.project,
      options.outputPath,
      options.configuration,
      options.noRestore,
    );
  });
});
