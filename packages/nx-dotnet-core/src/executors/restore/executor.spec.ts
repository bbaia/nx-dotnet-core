import { dotnet } from '../../utils';
import executor from './executor';
import { RestoreExecutorSchema } from './schema';

describe('Restore Executor', () => {
  beforeEach(() => {
    dotnet.restore = jest.fn(() => Promise.resolve({ success: true }));
  });

  it('should call dotnet restore', async () => {
    const options: RestoreExecutorSchema = {
      project: 'my-app',
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(dotnet.restore).toBeCalledTimes(1);
    expect(dotnet.restore).toBeCalledWith(options.project);
  });
});
