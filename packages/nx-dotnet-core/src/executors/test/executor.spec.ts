import { dotnet } from '../../utils';
import executor from './executor';
import { TestExecutorSchema } from './schema';

describe('Test Executor', () => {
  beforeEach(() => {
    dotnet.test = jest.fn(() => Promise.resolve({ success: true }));
    dotnet.watch = jest.fn(() => Promise.resolve({ success: true }));
  });

  it('should call dotnet test', async () => {
    const options: TestExecutorSchema = {
      project: 'my-app',
      watch: false,
      noRestore: false,
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(dotnet.test).toBeCalledTimes(1);
    expect(dotnet.watch).toBeCalledTimes(0);
    expect(dotnet.test).toBeCalledWith(options.project, options.noRestore);
  });

  it('should call dotnet watch test', async () => {
    const options: TestExecutorSchema = {
      project: 'my-app',
      watch: true,
      noRestore: false,
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(dotnet.test).toBeCalledTimes(0);
    expect(dotnet.watch).toBeCalledTimes(1);
    expect(dotnet.watch).toBeCalledWith(
      options.project,
      'test',
      options.noRestore,
    );
  });
});
