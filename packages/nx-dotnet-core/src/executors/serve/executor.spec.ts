import { dotnet } from '../../utils';
import executor from './executor';
import { ServeExecutorSchema } from './schema';

describe('Serve Executor', () => {
  beforeEach(() => {
    dotnet.watch = jest.fn(() => Promise.resolve({ success: true }));
  });

  it('should call dotnet watch run', async () => {
    const options: ServeExecutorSchema = {
      project: 'my-app',
      noRestore: true,
      verbose: false,
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(dotnet.watch).toBeCalledTimes(1);
    expect(dotnet.watch).toBeCalledWith(
      options.project,
      'run',
      options.noRestore,
      options.verbose,
    );
  });
});
