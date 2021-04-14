import { dotnet } from './dotnet-commands';

describe('dotnet commands', () => {
  beforeEach(() => {
    dotnet.spawn = jest.fn(() => Promise.resolve({ success: true }));
  });

  it('new', () => {
    const result = dotnet.new('webapi', 'root/src', 'my-api');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith([
      'new',
      'webapi',
      '--output',
      'root/src',
      '--name',
      'my-api',
    ]);
  });

  it('addProjectReference', () => {
    const result = dotnet.addProjectReference('root/tests', 'root/src');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith([
      'add',
      'root/tests',
      'reference',
      'root/src',
    ]);
  });

  it('addProjectToSolution', () => {
    const result = dotnet.addProjectToSolution('root', 'root/src');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith(['sln', 'root', 'add', 'root/src']);
  });

  it('watch run', () => {
    const result = dotnet.watch('root/src', 'run');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith([
      'watch',
      '--project',
      'root/src',
      'run',
    ]);
  });

  it('watch test', () => {
    const result = dotnet.watch('root/src', 'test');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith([
      'watch',
      '--project',
      'root/src',
      'test',
    ]);
  });

  it('publish', () => {
    const result = dotnet.publish('root/src', 'dist/my-app');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith([
      'publish',
      '--nologo',
      '--output',
      'dist/my-app',
      'root/src',
    ]);
  });

  it('publish with configuration', () => {
    const result = dotnet.publish('root/src', 'dist/my-app', 'Release');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith([
      'publish',
      '--nologo',
      '--output',
      'dist/my-app',
      '--configuration',
      'Release',
      'root/src',
    ]);
  });

  it('test', () => {
    const result = dotnet.test('root/src');

    expect(result).resolves.toEqual({ success: true });
    expect(dotnet.spawn).toBeCalledTimes(1);
    expect(dotnet.spawn).toBeCalledWith(['test', '--nologo', 'root/src']);
  });
});
